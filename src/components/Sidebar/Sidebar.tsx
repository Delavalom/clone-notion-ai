import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC } from "react";
import { toast } from "react-hot-toast";
import { useNavigation } from "~/hooks/useNavigation";
import { api } from "~/utils/api";

export const Sidebar: FC = () => {
  const { isOpen } = useNavigation();
  const { data: session } = useSession();
  const router = useRouter();
  const context = api.useContext();
  const { data: notes, isLoading } = api.note.getNotes.useQuery();
  const { mutate: addNewNote } = api.note.createNote.useMutation({
    async onSuccess(slug) {
      await router.push(`/${slug}`);
      await context.note.getNotes.refetch();
    },
  });
  const { mutate: deleteNote } = api.note.deleteNote.useMutation({
    async onSuccess() {
      await context.note.getNotes.refetch();
      const notes = context.note.getNotes.getData();
      const note = notes ? notes[0]?.id : "";
      await router.push(`/${note ?? ""}`);
      toast.success("Sucessfully delete Note");
    },
  });

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside
      className={`${
        !isOpen ? "hidden" : "flex transition duration-300"
      } z-50 h-full w-3/4 flex-col border-r-2 border-gray-500/5 border-opacity-100 bg-gray-50 md:w-2/4 lg:flex lg:w-1/4 2xl:w-2/12`}
    >
      <section
        id="AccountBar"
        className="mb-8 flex w-full p-4 hover:bg-gray-200"
      >
        <p className="w-60">{session?.user.name}&apos;s Notion</p>
      </section>
      <section
        id="NotesContainer"
        className="flex h-full flex-col justify-between"
      >
        <nav className="flex flex-col px-2">
          {notes?.map((note) => (
            <ul key={note.id} className="flex flex-col gap-2 px-1 py-2">
              <Link
                href={`/${note.id}`}
                className="group flex items-center justify-between gap-2 rounded-md p-1 text-gray-500 transition-colors duration-300 hover:bg-gray-200"
              >
                <li>
                  {"💬"} {note.title}
                </li>
                {note.id === router.asPath.replace("/", "") && (
                  <Trash2
                    className="w-4 text-gray-500 hover:text-gray-900"
                    onClick={() => deleteNote({ id: note.id })}
                  />
                )}
              </Link>
            </ul>
          ))}
        </nav>
        <button
          type="button"
          id="NewNoteButton"
          className="text-md flex items-center gap-2 border-y-2 border-gray-500/5 py-4 px-4 text-start text-gray-500 transition-colors duration-300 hover:bg-gray-200"
          onClick={() => addNewNote()}
        >
          + New Page
        </button>
      </section>
    </aside>
  );
};

const SidebarSkeleton: FC = () => {
  return (
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
  );
};
