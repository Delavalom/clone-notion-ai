import { ReactNode, type FC } from "react";
import { Sidebar } from "../Sidebar";
import { OverlayBg } from "./OverlayBg";
import { NavigationProvider } from "../../context/NavigationContext";
import Head from "next/head";

type Props = {
  children: ReactNode;
  title?: string | string[]
};

export const AppLayout: FC<Props> = ({ children, title = "Note"}) => {
  return (
    <NavigationProvider>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="bg-white w-screen h-screen flex">
        <Sidebar
          notes={[
            { title: "Cooking Recipes" },
            { title: "Employees" },
            { title: "Blog Posts" },
          ]}
        />
        <OverlayBg />
        <section className="flex-1">{children}</section>
      </main>
    </NavigationProvider>
  );
};
