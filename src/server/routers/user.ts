import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  updateUsername: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.username,
        },
        select: {
            username: true
        }
      });
    }),
});
