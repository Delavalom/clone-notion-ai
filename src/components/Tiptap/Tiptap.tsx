import { useState, type FC } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { MenuAI } from "./MenuAI";

type Props = unknown;

export const TipTap: FC<Props> = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
    ],
  });
  const [showModal, setShowModal] = useState(false);
  if (editor === null) return null;
  return (
    <>
      <MenuAI editor={editor} onClick={() => setShowModal(false)} />
      <EditorContent
        suppressContentEditableWarning={true}
        className="editorContent"
        editor={editor}
      />
    </>
  );
};
