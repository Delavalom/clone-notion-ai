import { z } from "zod";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

const users: { name: string }[] = [];

export const appRouter = router({
  get: procedure.query(({ input, ctx }) => {
    if (!ctx) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred, please try again later.",
      });
    }
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
