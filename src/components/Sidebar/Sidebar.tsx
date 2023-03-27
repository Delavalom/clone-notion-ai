import { useNavigation } from "~/hooks/useNavigation";
import { type FC } from "react";
import { Note } from "@prisma/client";
import Link from "next/link";
import { Session } from "next-auth";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

type Props = {};

export const Sidebar: FC<Props> = () => {
  const { isOpen } = useNavigation();
  const { data: session } = useSession();
  const router = useRouter();
  const context = api.useContext()
  const { data: notes, isLoading } = api.note.getNotes.useQuery();
  const { mutate: addNewNote } = api.note.createNote.useMutation({
    onSuccess(slug) {
      router.push(`/${slug}`);
    },
  });
  const { mutate: deleteNote,  } = api.note.deleteNote.useMutation({

    onMutate({ id }) {
      console.log(id)
      
      // if (router.asPath.replace("/", "") === id) {
      //   router.push(`/${lastNote.id}`);
      // }
    },
    onSuccess() {
      context.note.getNotes.refetch()
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
                <Trash2
                  className="hidden w-4 text-gray-500 hover:text-gray-900 group-hover:block"
                  onClick={() => deleteNote({ id: note.id })}
                />
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

type ModalProps = {
  setIsOpen: (arg: boolean) => void;
  isOpen: boolean;
  deleteNote: (arg: { id: string }) => void;
};

export const Modal: FC<ModalProps> = ({ setIsOpen, isOpen, deleteNote }) => {
  return (
    <div
      id="popup-modal"
      className="fixed top-0 left-0 right-0 z-50 hidden h-[calc(100%-1rem)] overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full"
    >
      <div className="relative h-full w-full max-w-md md:h-auto">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this note?
            </h3>
            <button
              data-modal-hide="popup-modal"
              type="button"
              className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            >
              Yes, I'm sure
            </button>
            <button
              data-modal-hide="popup-modal"
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
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
