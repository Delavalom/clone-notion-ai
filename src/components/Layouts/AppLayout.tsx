import { ReactNode, type FC } from "react";
import { Sidebar } from "../Sidebar";
import { OverlayBg } from "./OverlayBg";
import { NavigationProvider } from "../../context/NavigationContext";

type Props = {
  children: ReactNode;
};

export const AppLayout: FC<Props> = ({ children }) => {
  return (
    <NavigationProvider>
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
