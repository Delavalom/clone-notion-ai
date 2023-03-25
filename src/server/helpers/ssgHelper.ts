import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../routers/_app";
import { prisma } from "../db";
import superjson from 'superjson'
import { Session } from "next-auth";

export const ssgHelper = () => createProxySSGHelpers({
  router: appRouter,
  ctx: { prisma, session: { user: null } as unknown as Session | null},
  transformer: superjson
});
