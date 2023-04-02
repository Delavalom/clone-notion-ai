import { protectedProcedure, router } from "../trpc";
import { getLastUpdatedNote } from "../helpers/getLastUpdatedNote";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { elementSelect } from "../db";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { Descendant } from "slate";
import { takeCoverage } from "v8";

export type MyNotePayload = Prisma.NoteGetPayload<{
  include: {
    children: {
      select: typeof elementSelect;
    };
  };
}>;

const updateManyNotesSchema = z.object({
  id: z.string().uuid(),
  body: z
    .object({
      type: z.string(),
      children: z
        .object({
          text: z.string().min(1),
          bold: z.boolean().nullable(),
          italic: z.boolean().nullable(),
          code: z.boolean().nullable(),
          underline: z.boolean().nullable(),
          strikethrough: z.boolean().nullable(),
        })
        .array(),
    })
    .array()
}) satisfies z.ZodType<{id: string, body: Descendant[]}>

export type UpdateManyNotesSchema = z.infer<typeof updateManyNotesSchema>

export const getNote = (prisma: PrismaClient, id: string) => {
  return prisma.note.findUnique({
    where: {
      id,
    },
    include: {
      children: {
        select: elementSelect,
      },
    },
  });
};

export const noteRouter = router({
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.note.findMany();
  }),
  getNote: protectedProcedure
    .input(z.object({ id: z.string().uuid().min(1) }))
    .query(async ({ ctx, input }) => {
      const note = await getNote(ctx.prisma, input.id);

      if (!note) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return note;
    }),
  createNote: protectedProcedure.mutation(async ({ ctx }) => {
    const newNote = await ctx.prisma.note.create({
      data: {
        userId: ctx.session.user.id,
      },
    });
    return newNote.id;
  }),
  updateNoteTitle: protectedProcedure
    .input(z.object({ id: z.string().uuid(), title: z.string() }))
    .mutation(({ ctx, input }) => {
      if (input.title === "") {
        return ctx.prisma.note.update({
          where: {
            id: input.id,
          },
          data: {
            title: "untitled",
          },
        });
      }
      return ctx.prisma.note.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
    }),
  updateNoteBody: protectedProcedure
    .input(updateManyNotesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.redis.set(input.id, input.body)
      
    }),
  deleteNote: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = await ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
        select: {
          id: true,
        },
      });
      return {
        id,
      };
    }),
  getLastUpdatedNote: protectedProcedure.query(async ({ ctx }) => {
    return getLastUpdatedNote(ctx.session.user.id);
  }),
});
