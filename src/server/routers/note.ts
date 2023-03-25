import { protectedProcedure, router } from "../trpc";
import { getLastUpdatedNote } from "../helpers/getLastUpdatedNote";

export const noteRouter = router({
  getLastUpdatedNote: protectedProcedure.query(async ({ ctx }) => {
    return getLastUpdatedNote(ctx.session.user.id);
  }),
});
