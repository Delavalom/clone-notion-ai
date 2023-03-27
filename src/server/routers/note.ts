import { protectedProcedure, router } from "../trpc";
import { getLastUpdatedNote } from "../helpers/getLastUpdatedNote";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const noteRouter = router({
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.note.findMany();
  }),
  getNote: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
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

      return note;
    }),
  createNote: protectedProcedure.mutation(async ({ ctx }) => {
    const newNote = await ctx.prisma.note.create({
      data: {
        userId: ctx.session.user.id,
        body: "",
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
      const lastNote = await getLastUpdatedNote(ctx.session.user.id);
      return {
        id,
        lastNote,
      };
    }),
  getLastUpdatedNote: protectedProcedure.query(async ({ ctx }) => {
    return getLastUpdatedNote(ctx.session.user.id);
  }),
});
