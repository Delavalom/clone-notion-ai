import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { Session } from "next-auth";
import superjson from 'superjson';
import { prisma, redis } from "../db";
import { noteRouter } from "../routers/note";


export const ssgHelper = (session:  Session | null) => createProxySSGHelpers({
  router: noteRouter,
  ctx: { prisma, redis, session},
  transformer: superjson
});
