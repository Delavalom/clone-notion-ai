import { ArrowDown } from "lucide-react";
import { useState, type FC } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { useRenders } from "~/hooks/useRender";

export const SlateEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const { renderElement, renderLeaf } = useRenders();

  return (
    <Slate
      editor={editor}
      value={[
        {
          type: "paragraph",
          children: [{ text: "A line of text in a paragraph." }],
        },
      ]}
      onChange={(value) => {
        console.log(value);
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          // Save the value to Local Storage.
          console.log(JSON.stringify(value));
        }
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(e) => {
          if (!e.ctrlKey) {
            return;
          }

          switch (e.key) {
            // When "`" is pressed, keep our existing code block logic.
            case "`": {
              e.preventDefault();

              break;
            }

            // When "B" is pressed, bold the text in the selection.
            case "b": {
              e.preventDefault();

              break;
            }
          }
        }}
      />
    </Slate>
  );
};

export const MenuAI: FC = () => {
  const [input, setInput] = useState("");

  // async function getApiResult() {
  //   // TODO: Send the input data to the api call

  //   const response = await fetch("/api/generate", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ prompt: input }),
  //   });
  //   const { data } = await response.json() as { data: string; message: string } | { data: undefined, message: string }
  //   console.log(data)
  // }

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
      />
      <button className="mx-1 w-fit rounded-full bg-indigo-500 p-1 outline-none hover:bg-indigo-900 focus:outline-none">
        {/* TODO: Add a submit logo */}
        <ArrowDown className="h-4 w-4" />
      </button>
    </section>
  );
};
