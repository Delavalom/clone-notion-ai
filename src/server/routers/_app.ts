import { z } from "zod";
import { procedure, protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

const users: { name: string }[] = [];

export const appRouter = router({
  get: protectedProcedure.query(({ input, ctx }) => {
    return {
      notes: ctx.database
    };
  }),
  create: procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ input }) => {
      users.push(input);
      return {
        user: input,
      };
    }),
  update: procedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {}),
  delete: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input }) => {
      const { id } = input;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
