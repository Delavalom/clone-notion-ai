import { ArrowDown } from "lucide-react";
import { useCallback, useState, type FC } from "react";
import { Element, createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { CodeElement, DefaultElement } from "~/utils/editor";

type Props = {
  element: Element;
};

export const SlateEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;

      default:
        return <DefaultElement {...props} />;
    }
  }, []);

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
