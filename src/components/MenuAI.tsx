import { useState, type FC } from "react";
import { ArrowDown } from "lucide-react";

type Props = {
  editor: any;
  onClick: () => void;
};

export const MenuAI: FC<Props> = ({ editor, onClick }) => {
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
    <section className="bg-zinc-700 py-2 px-6 rounded-xl flex max-w-[700px] items-center">
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
        className="p-1 mx-1 w-fit rounded-full bg-indigo-500 hover:bg-indigo-900 outline-none focus:outline-none"
        onClick={getApiResult}
      >
        {/* TODO: Add a submit logo */}
        <ArrowDown className="w-4 h-4" />
      </button>
    </section>
  );
};
