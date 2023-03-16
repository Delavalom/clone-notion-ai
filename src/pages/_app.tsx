import "@/styles/globals.css";
import type { AppType } from "next/app";
import { api } from "../utils/api";
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

export default api.withTRPC(App);
