import { protectedProcedure, router } from "../trpc";
import { getLastUpdatedNote } from "../helpers/getLastUpdatedNote";
import { z } from "zod";

export const noteRouter = router({
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.note.findMany();
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
    .input(z.object({id: z.string(), title: z.string()}))
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
  getLastUpdatedNote: protectedProcedure.query(async ({ ctx }) => {
    return getLastUpdatedNote(ctx.session.user.id);
  }),
});
