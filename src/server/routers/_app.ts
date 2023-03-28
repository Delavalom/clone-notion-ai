import type { Session } from "next-auth";
import { prisma } from "../db";
import { router } from "../trpc";
import { noteRouter } from "./note";
import { userRouter } from "./user";

export const getUsername = async (id: Session["user"]["id"]) => {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const appRouter = router({
  user: userRouter,
  note: noteRouter 
});

// export type definition of API
export type AppRouter = typeof appRouter;
