import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export const databaseContext = async (opts: CreateNextContextOptions) => {
  const database = [
    {
      id: 0,
      title: "Employees",
      body: {
        text: "hey how your doing",
      },
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
    database,
  };
};

export type Context = inferAsyncReturnType<typeof databaseContext>;
