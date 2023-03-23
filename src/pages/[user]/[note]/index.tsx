import { createTRPCContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import  { type GetServerSidePropsContext } from "next";
import superjson from 'superjson'

export async function getServerSideProps(
    context: GetServerSidePropsContext<{ id: string }>,
  ) {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: await createTRPCContext(),
      transformer: superjson,
    });
    const id = context.params?.id as string;
    /*
     * Prefetching the `post.byId` query here.
     * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
     */
    await ssg.post.byId.prefetch({ id });
    // Make sure to return { props: { trpcState: ssg.dehydrate() } }
    return {
      props: {
        trpcState: ssg.dehydrate(),
        id,
      },
    };
  }