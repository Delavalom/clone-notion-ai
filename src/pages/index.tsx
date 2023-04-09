/* eslint-disable @typescript-eslint/no-misused-promises */
import { Inter } from "@next/font/google";
import type { GetServerSideProps, GetStaticProps } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { getServerAuthSession } from "~/server/auth";
import { ssgHelper } from "~/server/helpers/ssgHelper";
import styles from "~/styles/Home.module.css";


const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx)
  
  const ssg = ssgHelper(session)

  if (!session) {
    return {
      props: {},
    };
  }

  const note = await ssg.note.getLastUpdatedNote.fetch()

  return {
    redirect: {
      destination: `/${note.id}`,
      permanent: false,
    },
  };
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Notion-Clone-AI</title>
        <meta name="description" content="Notion-Clone-AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={`${inter.className} ${styles.heading ?? ""}`}>
          Welcome to
          <br /> Notion-Clone-AI
        </h1>
        <div className={styles.center}>
          <button className={styles.thirteen} onClick={() => signIn("github")}>
            Sign In/Sign up
          </button>
        </div>
      </main>
    </>
  );
}
