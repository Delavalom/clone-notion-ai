/* eslint-disable react/display-name */
import isHotkey from "is-hotkey";
import {
  Bold,
  Code,
  Italic,
  Strikethrough,
  Underline,
  type LucideIcon,
} from "lucide-react";
import {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  type ReactNode,
  type Ref,
} from "react";
import {
  Editor,
  Element as SlateElement,
  Transforms,
  createEditor,
  type BaseEditor,
  type Descendant,
} from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  Slate,
  useSlate,
  withReact,
  type ReactEditor,
  type RenderElementProps,
  type RenderLeafProps,
} from "slate-react";
import { useSelection } from "~/hooks/useSelection";
import { RenderElement, RenderLeaf } from "./Renders";

export type CustomText = {
  text: string;
  bold?: true;
  code?: true;
  italic?: true;
  underline?: true;
  strikethrough?: true;
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
  "mod+s": "strikethrough",
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
  {
    type: "paragraph",
    children: [
      {
        text: "Press `space` for AI, '/' for commands...",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Press `space` for AI, '/' for commands...",
      },
    ],
  },
];

type MemoEditableProps = {
  editor: Editor;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
};

export const MemoEditable = memo(
  ({ editor, renderElement, renderLeaf }: MemoEditableProps) => {
    return (
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(e) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, e)) {
              e.stopPropagation();
              e.preventDefault();
              const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    );
  }
);

export const SlateEditor = () => {
  const selection = useSelection();

  const renderElement = useCallback(
    (props: RenderElementProps) => <RenderElement {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <RenderLeaf {...props} />,
    []
  );

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={initialValue}>
      {/* 
        TODO: Toolbar only available when text highlighted 
        TODO: takes the editor.selection and style his position with offset: number and path [number, number]
        TODO: also takes the highlighted selection and transformed depending on option choosed
        TODO: the only way to make toolbar dissapear is by move cursor of selecting text or click outside toolbar
      */}
      {selection && (
        <Toolbar
          className={`relative flex w-fit items-center overflow-hidden rounded-lg bg-gray-900/5 shadow-md`}
        >
          <MarkButton type="bold" Icon={Bold} />
          <MarkButton type="italic" Icon={Italic} />
          <MarkButton type="underline" Icon={Underline} />
          <MarkButton type="strikethrough" Icon={Strikethrough} />
          <MarkButton type="code" Icon={Code} />
        </Toolbar>
      )}
      <MemoEditable
        editor={editor}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
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

const MarkButton = memo(
  ({ type, Icon }: { type: TextType; Icon: LucideIcon }) => {
    const editor = useSlate();
    return (
      <Button
        className="h-full w-full border-gray-500/5 px-2 py-2 transition-all duration-100 hover:border-x-2 hover:bg-gray-200"
        active={isMarkActive(editor, type)}
        onMouseDown={(e: MouseEvent) => {
          e.preventDefault();
          toggleMark(editor, type);
        }}
      >
        {<Icon className="h-4 w-4 stroke-gray-800 stroke-2" />}
      </Button>
    );
  }
);

type BaseProps = {
  className: string;
  children: ReactNode;
  active: boolean;
  [key: string]: unknown;
};

export const Toolbar = memo(
  forwardRef(
    (
      { className, children, ...props }: BaseProps,
      ref: Ref<HTMLDivElement>
    ) => (
      <Menu className={className} {...props} ref={ref}>
        {children}
      </Menu>
    )
  )
);

export const Button = memo(
  forwardRef(
    (
      { children, active, ...props }: BaseProps,
      ref: Ref<HTMLButtonElement>
    ) => (
      <button {...props} ref={ref} style={{ color: active ? "blue" : "black" }}>
        {children}
      </button>
    )
  )
);

export const Menu = forwardRef(
  ({ className, children, ...props }: BaseProps, ref: Ref<HTMLDivElement>) => (
    <div className={className} {...props} data-test-id="menu" ref={ref}>
      {children}
    </div>
  )
);
