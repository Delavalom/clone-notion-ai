import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getLastUpdatedNote } from "../helpers/getLastUpdatedNote";
import { protectedProcedure, router } from "../trpc";
import type { Descendant } from "slate";

export const noteRouter = router({
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.note.findMany();
  }),
  getNote: protectedProcedure
    .input(z.object({ id: z.string().uuid().min(1) }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!note) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      const content = await ctx.redis.get<Descendant[]>(input.id);

      if (!content) {
        return { note, content: [
          {
            type: "paragraph",
            children: [{ text: ""}]
          }
        ] satisfies Descendant[] };
        
      }
      return { note, content };
      
    }),
  createNote: protectedProcedure.mutation(async ({ ctx }) => {
    const newNote = await ctx.prisma.note.create({
      data: {
        userId: ctx.session.user.id,
      },
    });
    return newNote.id;
  }),
  updateNoteTitle: protectedProcedure
    .input(z.object({ id: z.string().uuid(), title: z.string() }))
    .mutation(({ ctx, input }) => {
      if (input.title === "") {
        return ctx.prisma.note.update({
          where: {
            id: input.id,
          },
          data: {
            title: "untitled",
          },
        });
      }
      return ctx.prisma.note.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
    }),
  updateNoteBody: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid().min(1),
        content: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.redis.set(input.id, input.content);
    }),
  deleteNote: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = await ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
        select: {
          id: true,
        },
      });
      return {
        id,
      };
    }),
  getLastUpdatedNote: protectedProcedure.query(async ({ ctx }) => {
    return getLastUpdatedNote(ctx.session.user.id);
  }),
});
