import { AppLayout } from "@/components/Layouts";
import { useRouter } from "next/router";
import { type FC } from "react";
import HamburgerAnimated from "@/components/HamburgerAnimated";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { authOptions } from "@/server/auth";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destionation: "/",
        permanent: true,
      },
      props: {}
    };
  }

  return {
    props: {
      session,
    },
  };
}

const Note: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ session }) => {

  return (
    <AppLayout>
      <Head>
        <title>{session?.user.id}</title>
      </Head>
      <section className="bg-white w-full h-full flex flex-col items-center overflow-y-scroll">
        <section className="flex w-full h-10 p-4">
          <HamburgerAnimated />
        </section>
        <div className="w-full max-w-[900px] mx-auto h-full flex flex-col items-center">
          <section className="w-full h-full max-h-32 flex flex-col items-center justify-end">
            {session?.user.id}
          </section>
          <article className="flex-1 w-full h-full flex flex-col items-center">
            <textarea></textarea>
          </article>
        </div>
      </section>
    </AppLayout>
  );
};

export default Note;
