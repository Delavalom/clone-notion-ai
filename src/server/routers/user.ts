import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
    getUsers: protectedProcedure.query(async ({ctx}) => {
        return ctx.prisma.user.findMany()
    }),
    getUser: protectedProcedure.query(async ({ctx}) => {
        return ctx.prisma.user.findMany()
    }),
})