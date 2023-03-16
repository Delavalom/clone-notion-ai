import { z } from "zod";
import { procedure, protectedProcedure, router } from "../trpc";

export const appRouter = router({
  addUsername: protectedProcedure
    .input(
      z.object({
        username: z.string().min(2).max(30),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userUpdate = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.username,
        },
      });
      return userUpdate
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
