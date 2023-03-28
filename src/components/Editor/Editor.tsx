import { ArrowDown } from "lucide-react";
import { useState, type FC } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

type Props = {};

export const Editor: FC<Props> = ({}) => {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <Slate
      editor={editor}
      value={[
        {
          type: "paragraph",
          children: [{ text: "A line of text in a paragraph." }],
        },
      ]}
    >
      <div>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          Code Block
        </button>
      </div>
      <Editable
        onKeyDown={(e) => {
          if (e.key === "/") {
            e.preventDefault();
            editor.insertText("hola");
          }
        }}
      />
    </Slate>
  );
};

type MenuAIProps = {
  editor: any;
  onClick: () => void;
};

export const MenuAI: FC<MenuAIProps> = ({ editor, onClick }) => {
  const [input, setInput] = useState("");

  async function getApiResult() {
    // TODO: Send the input data to the api call

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    });
    const { data } = await response.json();
    editor.chain().insertContent(data).run();
  }

  return (
    <section className="flex max-w-[700px] items-center rounded-xl bg-zinc-700 py-2 px-6">
      {/* TODO: add Star Logo */}
      <input
        className="flex-1 bg-zinc-700 text-zinc-50 outline-none"
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.currentTarget.value);
        }}
        placeholder="Ask anything to AI"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            getApiResult();
          }
        }}
      />
      <button
        className="mx-1 w-fit rounded-full bg-indigo-500 p-1 outline-none hover:bg-indigo-900 focus:outline-none"
        onClick={getApiResult}
      >
        {/* TODO: Add a submit logo */}
        <ArrowDown className="h-4 w-4" />
      </button>
    </section>
  );
};
