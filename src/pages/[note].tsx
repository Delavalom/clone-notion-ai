import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useState, type FC, useEffect } from "react";
import { OverlayBg } from "~/components/Layouts/OverlayBg";
import { Sidebar } from "~/components/Sidebar";
import { NavigationProvider } from "~/context/NavigationContext";
import { api } from "~/utils/api";
import notesBg from "../../public/notesBg.png";

type Props = {};

const Note: FC<Props> = ({}) => {
  const { data: session, status } = useSession();
  const { data: notes, isLoading } = api.note.getNotes.useQuery();
  const { note: path } = useRouter().query;
  const { mutate } = api.note.updateNoteTitle.useMutation();
  const note = notes?.find((note) => note.id === path);
  const [input, setInput] = useState<string>(note?.title ?? "untitled");

  useEffect(() => {
    if (input === note?.title || !note?.id) return;

    const updateTitle = setTimeout(() => {
      mutate({ id: note.id, title: input });
    }, 300);

    return () => clearTimeout(updateTitle);
  }, [input]);

  if (isLoading || status === "loading") {
    return <NoteSqueleton></NoteSqueleton>;
  }
  return (
    <NavigationProvider>
      <main className="flex h-screen w-screen bg-white">
        <Sidebar session={session} notes={notes ?? []} />
        <OverlayBg />
        <section className="flex h-full w-full flex-col items-center overflow-y-scroll bg-white">
          <picture className="h-[270px] w-full">
            <Image
              src={notesBg}
              width={1640}
              height={270}
              alt={`This is the background for the note`}
            />
          </picture>
          <div className="mx-auto flex h-full w-full max-w-[900px] flex-col items-center">
            <section
              id="titleSection"
              className="mb-4 flex h-full max-h-32 w-full flex-col items-center justify-end"
            >
              <input
                onChange={(e) => setInput(e.currentTarget.value)}
                value={input}
                className="w-full max-w-[700px] text-left text-4xl font-black text-gray-800 outline-none"
              />
            </section>
            <article
              role="textbox"
              aria-multiline={true}
              className="flex h-full w-full max-w-[700px] flex-1 flex-col text-left"
            >
              {path}
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
