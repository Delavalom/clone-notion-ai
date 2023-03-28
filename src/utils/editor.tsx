import { type HTMLAttributes, type ReactNode } from "react";
import { BaseEditor, Descendant, Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";


export const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

export const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const CustomEditor = {
  isBoldMarkActive(editor: Editor) {},

  toggleBoldMark(editor: Editor) {},

  toggleCodeBlock(editor: Editor) {},
}

{/*
  {Leafs}
  We need to be able to transform text to bold, strike, underline, italic code, link, and heading with 3 levels. leafs

  {Elements}
  We need to be able to create quote blocks, code blocks, bullet list, numbered list, todo list, code, and headings with 3 levels 

*/}

[
  { type: "paragraph", children: [{ text: "hey" }] },
  { type: "paragraph", children: [{ text: "how you doing jaja tank" }] },
  { type: "paragraph", children: [{ text: "super cool why?" }] },
  { type: "paragraph", children: [{ text: "I dpont' foll" }] },
  { type: "paragraph", children: [{ text: "*know" }] },
  { type: "paragraph", children: [{ text: "" }] },
  { type: "paragraph", children: [{ text: "" }] },
];