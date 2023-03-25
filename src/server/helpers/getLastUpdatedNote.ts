import { TRPCError } from "@trpc/server";
import { prisma } from "../db";

export const getLastUpdatedNote = async (id: string) => {
  const notes = await prisma.note.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  const note = notes.find((note) => note.userId === id);
  if (!note) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }
  return note
};
