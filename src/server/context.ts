import { getServerAuthSession } from "@/server/auth";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import { prisma } from './db'

type CreateContextOptions = {
  session: Session | null;
};

export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createInnerTRPCContext>;
