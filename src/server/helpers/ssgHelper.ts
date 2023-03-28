import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { Session } from "next-auth";
import superjson from 'superjson';
import { prisma } from "../db";
import { appRouter } from "../routers/_app";

export const ssgHelper = (session:  Session | null) => createProxySSGHelpers({
  router: appRouter,
  ctx: { prisma, session},
  transformer: superjson
});
