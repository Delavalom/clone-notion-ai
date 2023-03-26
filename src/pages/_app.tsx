import "~/styles/globals.css";
import type { AppType } from "next/app";
import { api } from "~/utils/api";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Toaster } from 'react-hot-toast'

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(App);
