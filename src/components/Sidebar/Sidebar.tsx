import { useNavigation } from "~/hooks/useNavigation";
import { type FC } from "react";
import { Note } from "@prisma/client";
import Link from "next/link";
import { Session } from "next-auth";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

type Props = {
  session: Session | null;
  notes: Note[];
};

export const Sidebar: FC<Props> = ({ session, notes }) => {
  const { isOpen } = useNavigation();
  const router = useRouter()
  const { mutate, data: newNoteId } = api.note.createNote.useMutation();

  async function handleCreate() {
    await mutate()
    router.push(`/${newNoteId}`)
  }

  return (
    <aside
      className={`${
        !isOpen ? "hidden" : "flex transition duration-300"
      } z-50 h-full w-3/4 flex-col border-r-2 border-opacity-100 bg-zinc-100 md:w-2/4 lg:flex lg:w-1/4 2xl:w-2/12`}
    >
      <section
        id="AccountBar"
        className="mb-8 flex w-full p-4 hover:bg-zinc-200"
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
              <Link href={`/${note.id}`}>
                <li className="text-md rounded-md p-1 text-zinc-500 hover:bg-zinc-200">
                  {"💬"} {note.title}
                </li>
              </Link>
            </ul>
          ))}
        </nav>
        <button
          type="button"
          id="NewNoteButton"
          className="text-md flex items-center gap-2 border-y-2 py-4 px-4 text-start text-zinc-500 hover:bg-zinc-200"
          onClick={handleCreate}
        >
          + New Page
        </button>
      </section>
    </aside>
  );
};
