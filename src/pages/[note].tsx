import { AppLayout } from "@/components/Layouts";
import { TipTap } from "@/components/Tiptap";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, type FC } from "react";
import { NavigationContext } from "@/context/NavigationContext";
import HamburgerAnimated from "@/components/HamburgerAnimated";

type Props =  {
};

const Note: FC<Props> = () => {
  const { note } = useRouter().query;

  return (
    <AppLayout>
      <Head>
        <title>{note}</title>
      </Head>
        <section className="bg-white w-full h-full flex flex-col items-center overflow-y-scroll">
            <section className="flex w-full h-10 p-4">
              <HamburgerAnimated />
            </section>
          <div className="w-full max-w-[900px] mx-auto h-full flex flex-col items-center">
            <section
              id="titleSection"
              className="w-full h-full max-h-32 flex flex-col items-center justify-end"
            >
              {note}
            </section>
            <article
              role="textbox"
              contentEditable="true"
              aria-multiline={true}
              className="flex-1 w-full h-full flex flex-col items-center"
            >
              {/* <TipTap /> */}
            </article>
          </div>
      </section>
    </AppLayout>
  );
};

export default Note;
