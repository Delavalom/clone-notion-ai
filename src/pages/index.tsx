import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { trpc } from "@/lib/trpc";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const hello = trpc.hello.useQuery({text: 'client'})
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
            Welcome to<br/> Notion-Clone-AI
          </h1>
        <div className={styles.center}>
          <h1>{hello.data?.greeting}</h1>
          <button className={styles.thirteen}>Sign In/Sign up</button>
        </div>
      </main>
    </>
  );
}
