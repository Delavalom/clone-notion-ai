import { type FC } from "react";

type Props = {};

export const Sidebar: FC<Props> = ({}) => {
  return (
    <aside className=" bg-zinc-100 w-3/4 md:w-2/4 lg:w-1/4 2xl:w-2/12 h-full flex flex-col border-r-2 border-opacity-100">
      <section id="AccountBar" className="p-4 w-fit hover:bg-zinc-200">
        <p className="w-60">Luis Arvelo&apos;s Notion</p>
      </section>
      <section id="NotesContainer" className="h-full flex flex-col justify-between">
        <ul id="Notes" className="flex flex-col gap-2 px-1 py-4">
          <li className="hover:bg-zinc-200 rounded-md py-1 px-2 text-zinc-500 text-md">
            Cooking Recipes
          </li>
          <li className="hover:bg-zinc-200 rounded-md py-1 px-2 text-zinc-500 text-md">
            Employees
          </li>
          <li className="hover:bg-zinc-200 rounded-md py-1 px-2 text-zinc-500 text-md">
            Blog Posts
          </li>
        </ul>
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
