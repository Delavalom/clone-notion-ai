import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../trpc";
import { prisma } from "../db";
import { Session } from "next-auth";

export const getUsername = async (id: Session["user"]["id"]) => {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

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
      return userUpdate;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
