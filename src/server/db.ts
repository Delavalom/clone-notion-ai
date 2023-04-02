import { PrismaClient, type Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const textSelect = {
  text: true,
  bold: true,
  italic: true,
  code: true,
  underline: true,
  strikethrough: true,
} satisfies Prisma.TextSelect;

export const elementSelect = {
  type: true,
  children: {
    select: textSelect,
  },
} satisfies Prisma.ElementSelect;

export type MyNotePayload = Prisma.NoteGetPayload<{
  include: {
    children: {
      select: typeof elementSelect;
    };
  };
}>;