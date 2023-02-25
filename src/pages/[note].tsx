import { AppLayout } from "@/components/Layouts";
import { useRouter } from "next/router";
import { type FC } from "react";
import HamburgerAnimated from "@/components/HamburgerAnimated";

type Props =  {
};

const Note: FC<Props> = () => {
  const { note } = useRouter().query;

  return (
    <AppLayout title={note}>
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
