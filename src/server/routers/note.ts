import type { Descendant } from "slate";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const noteRouter = router({
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      },
      select: {
        notes: true
      }
    });
    if (!data) return [] 
    return data.notes

  }),
  getNote: protectedProcedure
    .input(z.object({ id: z.string().uuid().min(1) }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!note || note.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND"
        })
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
    const notes = await ctx.prisma.note.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    const note = notes.find((note) => note.userId === ctx.session.user.id);
    if (!note) {
      const newNote = await ctx.prisma.note.create({
        data: {
          userId: ctx.session.user.id,
        },
      })
      return newNote
    }
    return note
  }),
});
