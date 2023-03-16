import { useNavigation } from "@/hooks/useNavigation";
import { api } from "@/utils/api";
import { type FC } from "react";

type Notes = {
  title: string;
  body?: any;
};

type Props = {
  notes: Notes[];
};

export const Sidebar: FC<Props> = ({}) => {
  const { isOpen } = useNavigation();
  const create = api.create.useMutation()
  const data = api.useContext().get.getData();

  function handleCreate() {
    create.mutate({name:""})
  }

  return (
    <aside
      className={`${
        !isOpen ? "hidden" : "flex transition duration-300"
      } bg-zinc-100 z-50 w-3/4 md:w-2/4 lg:w-1/4 2xl:w-2/12 h-full lg:flex flex-col border-r-2 border-opacity-100`}
    >
      <section id="AccountBar" className="p-4 w-full hover:bg-zinc-200 flex">
        <p className="w-60">Luis Arvelo&apos;s Notion</p>
      </section>
      <section
        id="NotesContainer"
        className="h-full flex flex-col justify-between"
      >
        {data?.notes?.map((note) => (
          <ul key={note.id} className="flex flex-col gap-2 px-1 py-4">
            <li className="hover:bg-zinc-200 rounded-md py-1 px-2 text-zinc-500 text-md">
              {note.title}
            </li>
          </ul>
        ))}
        <button
          type="button"
          id="NewNoteButton"
          className=" hover:bg-zinc-200 py-4 px-4 border-y-2 text-start flex items-center gap-2 text-zinc-500 text-md"
        >
          + New Page
        </button>
      </section>
    </aside>
  );
};
