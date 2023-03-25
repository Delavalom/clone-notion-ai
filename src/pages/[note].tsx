import { useRouter } from "next/router";
import { type FC } from "react";
import { AppLayout } from "~/components/Layouts";
import { OverlayBg } from "~/components/Layouts/OverlayBg";
import { Sidebar } from "~/components/Sidebar";
import { NavigationProvider } from "~/context/NavigationContext";
import { api } from "~/utils/api";

type Props = {};

const Note: FC<Props> = ({}) => {
  const notes = api
  const { note } = useRouter().query;
  return (
    <NavigationProvider>
      <main className="flex h-screen w-screen bg-white">
        <Sidebar
          notes={[
            { id: 1, title: "Cooking Recipes" },
            { id: 2, title: "Employees" },
            { id: 3, title: "Blog Posts" },
          ]}
        />
        <OverlayBg />
        <section className="flex h-full w-full flex-col items-center overflow-y-scroll bg-white">
          <div className="mx-auto flex h-full w-full max-w-[900px] flex-col items-center">
            <section
              id="titleSection"
              className="flex h-full max-h-32 w-full flex-col items-center justify-end"
            >
              {note}
            </section>
            <article
              role="textbox"
              aria-multiline={true}
              className="flex h-full w-full flex-1 flex-col items-center"
            >
              {note}
            </article>
          </div>
        </section>
      </main>
    </NavigationProvider>
  );
};

export default Note;
