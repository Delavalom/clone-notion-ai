import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../routers/_app";
import { prisma } from "../db";
import superjson from 'superjson'
import { Session } from "next-auth";

export const ssgHelper = (session:  Session | null) => createProxySSGHelpers({
  router: appRouter,
  ctx: { prisma, session},
  transformer: superjson
});
