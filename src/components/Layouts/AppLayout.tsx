import { ReactNode, type FC } from "react";
import { Sidebar } from "../Sidebar";
import { OverlayBg } from "./OverlayBg";
import { NavigationProvider } from "~/context/NavigationContext";
import Head from "next/head";

type Props = {
  children: ReactNode;
};

export const AppLayout: FC<Props> = ({ children }) => {
  return (
    <NavigationProvider>
      <main className="bg-white w-screen h-screen flex">
        <Sidebar
          notes={[
            { id: 1, title: "Cooking Recipes" },
            { id: 2, title: "Employees" },
            { id: 3, title: "Blog Posts" },
          ]}
        />
        <OverlayBg />
        <section className="flex-1">{children}</section>
      </main>
    </NavigationProvider>
  );
};
