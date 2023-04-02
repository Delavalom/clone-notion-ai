/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ArrowDown } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { useSlate } from "slate-react";

export const MenuAI = ({
  style,
  setIsAIMenuOpen,
}: {
  style: CSSProperties;
  setIsAIMenuOpen: (isAIMenuOpen: boolean) => void;
}) => {
  const [input, setInput] = useState("");
  const editor = useSlate();

  async function getApiResult() {
    // TODO: Send the input data to the api call

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    });
    const { data } = (await response.json()) as
      | { data: string; message: string }
      | { data: undefined; message: string };

    if (!data) return;
    console.log(data);
    editor.insertText(data);
    setIsAIMenuOpen(false)
  }

  return (
    <section
      style={style}
      className="absolute z-50 flex max-w-[700px] items-center rounded-xl bg-gray-900/5 px-6 py-2 shadow-sm shadow-gray-900/25"
    >
      {/* TODO: add Star Logo */}
      <input
        className="flex-1 bg-gray-900/5 text-gray-900 placeholder-gray-900 outline-none"
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.currentTarget.value);
        }}
        placeholder="Ask anything to AI"
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          getApiResult();
        }}
        className="mx-1 w-fit rounded-full bg-gray-900 p-1 outline-none transition-colors duration-150 hover:bg-gray-300 focus:outline-none"
      >
        <ArrowDown className="h-4 w-4 stroke-gray-50" />
      </button>
    </section>
  );
};
