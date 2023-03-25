import { protectedProcedure, router } from "../trpc";
import { getLastUpdatedNote } from "../helpers/getLastUpdatedNote";

export const noteRouter = router({
  getNotes: protectedProcedure.query(async ({ctx}) => {
    return ctx.prisma.note.findMany()
  }),
  createNote: protectedProcedure.mutation(async ({ctx}) => {
    const newNote = await ctx.prisma.note.create({
      data: {
        userId: ctx.session.user.id,
        body: ""
      }
    })
    return newNote.id
  }),
  getLastUpdatedNote: protectedProcedure.query(async ({ ctx }) => {
    return getLastUpdatedNote(ctx.session.user.id);
  }),
});
