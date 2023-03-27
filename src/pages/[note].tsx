import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, type FC, useEffect } from "react";
import { OverlayBg } from "~/components/Layouts/OverlayBg";
import { Sidebar } from "~/components/Sidebar";
import { NavigationProvider } from "~/context/NavigationContext";
import { api } from "~/utils/api";
import notesBg from "../../public/notesBg.png";
import { toast } from "react-hot-toast";

type Props = {};

const Note: FC<Props> = ({}) => {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const { note: path } = useRouter().query;
  const { data: notes, isLoading } = api.note.getNotes.useQuery(undefined, {
    onSuccess(data) {
      setInput(data.find((note) => note.id === path)?.title ?? "untitled");
      toast.success("Successfully fetch data");
    },
    onError() {
      toast.error("Couldn't the fetch data");
    },
  });
  const note = notes?.find((note) => note.id === path);
  const { mutate } = api.note.updateNoteTitle.useMutation({
    onSuccess(data) {
      toast.success("Successfully update title");
    },
    onError({ message }) {
      toast.error(message);
    },
  });

  useEffect(() => {
    if (input === note?.title || !note?.id) return;

    const updateTitle = setTimeout(() => {
      mutate({ id: note.id, title: input });
    }, 700);

    return () => clearTimeout(updateTitle);
  }, [input]);

  if (isLoading || status === "loading") {
    return <NoteSkeleton />;
  }
  return (
    <NavigationProvider>
      <main className="flex h-screen w-screen bg-white transition-all duration-200">
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

const NoteSkeleton = () => {
  return (
    <main className="flex h-screen w-screen bg-white transition-all duration-200">
      <aside className=" h-full w-3/4 flex-col border-r-2 border-opacity-100 bg-zinc-100 md:w-2/4 lg:flex lg:w-1/4 2xl:w-2/12">
        <section
          id="AccountBar"
          className="mb-8 flex w-full p-4 hover:bg-zinc-200"
        >
          <div className="skeleton h-8 w-full rounded-2xl " />
        </section>
        <section
          id="NotesContainer"
          className="flex h-full flex-col justify-between"
        >
          <nav className="flex flex-col gap-4 px-2">
            <div className="skeleton h-3 w-4/5 rounded-lg " />
            <div className="skeleton h-3 w-4/5 rounded-lg " />
          </nav>
        </section>
      </aside>
      <section className="flex h-full w-full flex-col items-center overflow-y-scroll bg-white">
        <div className="skeleton mt-10 h-16 w-10/12 rounded-full" />
        <div className="mx-auto flex h-full w-full max-w-[900px] flex-col items-center">
          <section
            id="titleSection"
            className="mb-4 flex h-full max-h-32 w-full flex-col items-center justify-end gap-4"
          >
            <div className="skeleton h-8 w-2/5 rounded-2xl" />
            <div className="skeleton h-3 w-4/5 rounded-lg" />
          </section>
          <article
            role="textbox"
            aria-multiline={true}
            className="flex h-full w-full max-w-[700px] flex-1 flex-col text-left"
          >
            <div className="skeleton h-3 w-2/5 rounded-lg" />
          </article>
        </div>
      </section>
    </main>
  );
};
