import { getServerAuthSession } from "@/server/auth";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Session } from "next-auth";

type CreateContextOptions = {
  session: Session | null;
};

export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  const database = [
    {
      user: "",
      notes: [
        {
          id: 0,
          title: "Employees",
          body: {
            text: "hey how your doing",
          },
        },
      ],
    },
    {
      id: 1,
      title: "whatever",
      body: {
        text: "hey how your doing",
      },
    },
    {
      id: 2,
      title: "some notes",
      body: {
        text: "hey how your doing",
      },
    },
  ];
  return {
    session: opts.session,
    database,
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
