import "@/styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../lib/trpc";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
