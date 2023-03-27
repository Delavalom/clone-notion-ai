import type { Note } from "@prisma/client";
import Image from "next/image";
import { withRouter, type Router } from "next/router";
import { useEffect, useState, type FC } from "react";
import { toast } from "react-hot-toast";
import { OverlayBg } from "~/components/Layouts/OverlayBg";
import { Sidebar } from "~/components/Sidebar";
import { NavigationProvider } from "~/context/NavigationContext";
import { api } from "~/utils/api";
import notesBg from "../../public/notesBg.png";

type Props = {
  router: Router;
};

const Note: FC<Props> = ({ router }) => {
  const [input, setInput] = useState("");

  const { data: note, isLoading } = api.note.getNote.useQuery(
    { id: router.asPath.replace("/", "") },
    {
      enabled: router.isReady,
      onSuccess(data) {
        setInput(data.title);
        toast.success("Successfully fetch data");
      },
      onError(err) {
        toast.error(err.message);
      },
    }
  );

  const { mutate } = api.note.updateNoteTitle.useMutation({
    onSuccess() {
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

  if (isLoading) {
    return <NoteSkeleton />;
  }

  return (
    <NavigationProvider>
      <main className="flex h-screen w-screen bg-white transition-all duration-200">
        <Sidebar />
        <OverlayBg />
        <section className="flex h-full w-full flex-col items-center overflow-y-scroll bg-white">
          <NoteBanner isLoading={isLoading} />
          <div className="mx-auto flex h-full w-full max-w-[900px] flex-col items-center">
            <section
              id="titleSection"
              className="mb-4 flex h-full max-h-32 w-full flex-col items-center justify-end"
            >
              {/* create a new component for title */}
              <input
                onChange={(e) => setInput(e.currentTarget.value)}
                value={input}
                className="w-full max-w-[700px] text-left text-4xl font-black text-gray-800 outline-none"
              />
            </section>
            {/* create a new component for article */}
            <article
              role="textbox"
              aria-multiline={true}
              className="flex h-full w-full max-w-[700px] flex-1 flex-col text-left"
            ></article>
          </div>
        </section>
      </main>
    </NavigationProvider>
  );
};

export default withRouter(Note);

const NoteSkeleton = () => {
  return (
    <main className="flex h-screen w-screen bg-white transition-all duration-200">
      <section className="flex h-full w-full flex-col items-center overflow-y-scroll bg-white">
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
type NoteBannerProp = {
  isLoading: boolean;
};

const NoteBanner: FC<NoteBannerProp> = ({ isLoading }) => {
  if (isLoading) {
    return <div className="skeleton mt-10 h-16 w-10/12 rounded-full" />;
  }

  return (
    <picture className="h-[270px] w-full">
      <Image
        src={notesBg}
        width={1640}
        height={270}
        alt={`This is the background for the note`}
      />
    </picture>
  );
};
