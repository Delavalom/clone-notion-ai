import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { signIn } from "next-auth/react";
import { GetStaticProps } from "next";
import { ssgHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const inter = Inter({ subsets: ["latin"] });

export const getStaticProps: GetStaticProps = async  (ctx) => {

  const ssg = ssgHelper()

  await ssg.note.getLastUpdatedNote.prefetch()

  return {
    props: {
      trpcState: ssg.dehydrate()
    },
  };
};

export default function Home() {
  const { data } = api.note.getLastUpdatedNote.useQuery()
  return (
    <>
      <Head>
        <title>Notion-Clone-AI</title>
        <meta name="description" content="Notion-Clone-AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={`${inter.className} ${styles.heading}`}>
          Welcome to
          <br /> Notion-Clone-AI
        </h1>
        <div className={styles.center}>
          <button
            className={styles.thirteen}
            onClick={() => signIn()}
          >
            Sign In/Sign up
          </button>
        </div>
      </main>
    </>
  );
}
