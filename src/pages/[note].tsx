import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { type FC } from "react";
import { OverlayBg } from "~/components/Layouts/OverlayBg";
import { Sidebar } from "~/components/Sidebar";
import { NavigationProvider } from "~/context/NavigationContext";
import { api } from "~/utils/api";
import notesBg from '../../public/notesBg.png'

type Props = {};

const Note: FC<Props> = ({}) => {
  const { data: session, status } = useSession();
  const { data: notes, isLoading } = api.note.getNotes.useQuery();
  const { note } = useRouter().query;

  if (isLoading || status === "loading") {
    return <NoteSqueleton></NoteSqueleton>;
  }

  return (
    <NavigationProvider>
      <main className="flex h-screen w-screen bg-white">
        <Sidebar session={session} notes={notes ?? []} />
        <OverlayBg />
        <section className="flex h-full w-full flex-col items-center overflow-y-scroll bg-white">
          <picture className="w-[1440px] h-[270px]">
            <Image
              src={notesBg}
              width={1440}
              height={270}
              alt={`This is the background for the note`}
            />
          </picture>
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

const NoteSqueleton = () => {
  return <></>;
};
