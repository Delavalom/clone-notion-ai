import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "~/styles/Home.module.css";
import { signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { getLastUpdatedNote } from "~/server/helpers/getLastUpdatedNote";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const note = await getLastUpdatedNote(session.user.id);

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
        <h1 className={`${inter.className} ${styles.heading}`}>
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
