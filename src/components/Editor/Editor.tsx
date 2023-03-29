/* eslint-disable react/display-name */
import {
  type Ref,
  forwardRef,
  useCallback,
  useState,
  type ReactNode,
  type LegacyRef,
} from "react";
import {
  createEditor,
  type BaseEditor,
  type Descendant,
  Editor,
  Transforms,
  Element as SlateElement,
} from "slate";
import {
  Editable,
  Slate,
  withReact,
  type ReactEditor,
  type RenderLeafProps,
  type RenderElementProps,
} from "slate-react";
import { RenderElement, RenderLeaf } from "./Renders";
import isHotkey from "is-hotkey";

export type CustomText = {
  text: string;
  bold?: true;
  code?: true;
  italic?: true;
  underline?: true;
};

export type CustomElement = {
  type:
    | "paragraph"
    | "bulleted-list"
    | "block-quote"
    | "heading-one"
    | "heading-two"
    | "heading-three"
    | "list-item"
    | "numbered-list";
  level?: 1 | 2 | 3;
  align?: string;
  children: CustomText[];
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
} as const;

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "Press `space` for AI, '/' for commands...",
      },
    ],
  },
];

export const SlateEditor = () => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <RenderElement {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <RenderLeaf {...props} />,
    []
  );
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

type TextType = keyof Omit<CustomText, "text">;

const isMarkActive = (editor: Editor, textType: TextType) => {
  const marks = Editor.marks(editor);
  return marks ? marks[textType] === true : false;
};

export const toggleMark = (editor: Editor, textType: TextType) => {
  const isActive = isMarkActive(editor, textType);

  if (isActive) {
    Editor.removeMark(editor, textType);
  } else {
    Editor.addMark(editor, textType, true);
  }
};

const isBlockActive = (editor: Editor, type: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof CustomElement] === type,
    })
  );

  return !!match;
};

export const toggleBlock = (editor: Editor, type: CustomElement["type"]) => {
  const isActive = isBlockActive(
    editor,
    type,
    TEXT_ALIGN_TYPES.includes(type) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(type);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(type),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(type)) {
    newProperties = {
      align: isActive ? undefined : type,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : type,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

type BaseProps = {
  className: string;
  children: ReactNode;
  [key: string]: unknown;
};

export const Toolbar = forwardRef(
  ({ className, ...props }: BaseProps, ref: Ref<HTMLDivElement>) => (
    <Menu className={className} {...props} ref={ref} />
  )
);

export const Button = forwardRef(
  (props: BaseProps, ref: LegacyRef<HTMLSpanElement>) => (
    <span {...props} ref={ref} />
  )
);

export const Menu = forwardRef(
  ({ className, ...props }: BaseProps, ref: Ref<HTMLDivElement>) => (
    <div className={className} {...props} data-test-id="menu" ref={ref} />
  )
);
