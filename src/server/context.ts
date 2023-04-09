import { getServerAuthSession } from "~/server/auth";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma, redis } from './db'

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return {
    session,
    prisma,
    redis,
  };
};



export type Context = inferAsyncReturnType<typeof createTRPCContext>;
