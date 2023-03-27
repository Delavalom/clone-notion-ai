import { useNavigation } from "~/hooks/useNavigation";
import { type FC } from "react";
import { Note } from "@prisma/client";
import Link from "next/link";
import { Session } from "next-auth";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Trash2 } from "lucide-react";

type Props = {
  session: Session | null;
  notes: Note[];
};

export const Sidebar: FC<Props> = ({ session, notes }) => {
  const { isOpen } = useNavigation();
  const router = useRouter();
  const { mutate: addNewNote } = api.note.createNote.useMutation({
    onSuccess(slug) {
      router.push(`/${slug}`);
    },
  });

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
              <Link href={`/${note.id}`} className="group flex gap-2 items-center justify-between rounded-md p-1 text-gray-500 hover:bg-gray-200 transition-colors duration-300">
                <li>
                  {"💬"} {note.title}
                </li>
                <Trash2 className="hidden group-hover:block w-4 text-gray-500 hover:text-gray-900" onClick={() => {}}/>
              </Link>
            </ul>
          ))}
        </nav>
        <button
          type="button"
          id="NewNoteButton"
          className="text-md flex items-center gap-2 border-y-2 border-gray-500/5 py-4 px-4 text-start text-gray-500 hover:bg-gray-200 transition-colors duration-300"
          onClick={() => addNewNote()}
        >
          + New Page
        </button>
      </section>
    </aside>
  );
};
