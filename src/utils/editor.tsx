/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HTMLAttributes, ReactNode } from "react";
import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";

type CustomText = { text: string; type?: string[] };

export type CustomElement = {
  type:
    | "paragraph"
    | "code"
    | "link"
    | "bulleted-list"
    | "block-quote"
    | "heading-one"
    | "heading-two"
    | "heading-three"
    | "list-item"
    | "numbered-list";
  level?: 1 | 2 | 3;
  url?: string;
  children: CustomText[];
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

declare module "slate-react" {
  interface CustomTypesReact {
    RenderElementProps: {
      children: any;
      element: CustomElement;
      attributes: {
        "data-slate-node": "element";
        "data-slate-inline"?: true;
        "data-slate-void"?: true;
        dir?: "rtl";
        ref: any;
      };
    };
    RenderLeafProps: {
      children: any;
      leaf: Text;
      text: Text;
      attributes: {
        "data-slate-leaf": true;
      };
    };
  }
}

export const LinkElement = (props: {
  href: string | undefined;
  attributes: HTMLAttributes<HTMLAnchorElement>;
  children: ReactNode;
}) => {
  return <a href={props.href ?? "#"}>{props.children}</a>;
};

export const CodeElement = (props: {
  attributes: HTMLAttributes<HTMLPreElement>;
  children: ReactNode;
}) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

export const QuoteElement = (props: {
  attributes: HTMLAttributes<HTMLQuoteElement>;
  children: ReactNode;
}) => {
  return <blockquote {...props.attributes}>{props.children}</blockquote>;
};

export const DefaultElement = (props: {
  attributes: HTMLAttributes<HTMLParagraphElement>;
  children: ReactNode;
}) => {
  return <p {...props.attributes}>{props.children}</p>;
};

// const CustomEditor = {
//   isBoldMarkActive(editor: Editor) {},

//   toggleBoldMark(editor: Editor) {},

//   toggleCodeBlock(editor: Editor) {},
// };

{
  /*
  {Leafs}
  We need to be able to transform text to [x] bold, strike, underline, italic code, link. leafs

  {Elements}
  We need to be able to create [x] quote blocks, [x] code blocks, bullet list, numbered list, todo list, code, and headings with 3 levels 

*/
}
