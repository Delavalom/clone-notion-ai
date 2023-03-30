/* eslint-disable react/display-name */
import isHotkey from "is-hotkey";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  LayoutList,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Type,
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
  useState,
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

export const SlateEditor = () => {
  const selection = useSelection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <Toolbar className="relative flex w-fit items-center overflow-hidden rounded-lg  border border-gray-900/5 shadow-lg shadow-gray-300 transition-all duration-200">
          <MarkButton type="bold" Icon={Bold} />
          <MarkButton type="italic" Icon={Italic} />
          <MarkButton type="underline" Icon={Underline} />
          <MarkButton type="strikethrough" Icon={Strikethrough} />
          <MarkButton type="code" Icon={Code} />
        </Toolbar>
      )}
      {isMenuOpen && (
        <Toolbar className="duration-2000 relative flex max-h-[400px] w-fit flex-col overflow-y-scroll scroll-smooth rounded-lg  border border-gray-900/5 p-1 shadow-lg shadow-gray-300 transition-all">
          {/* <p className="text-gray-900/60 text-xs font-medium px-4">Basic blocks</p>s */}
          <BlockButton
            type="paragraph"
            title="Text"
            subTitle="Just start writing with plain text."
            Icon={Type}
          />
          <BlockButton
            type="list-item"
            title="To-do List"
            subTitle="Track tasks with a to-do list."
            Icon={LayoutList}
          />
          <BlockButton
            type="heading-one"
            title="Heading 1"
            subTitle="Big section heading."
            Icon={Heading1}
          />
          <BlockButton
            type="heading-two"
            title="Heading 2"
            subTitle="Medium section heading."
            Icon={Heading2}
          />
          <BlockButton
            type="heading-three"
            title="Heading 3"
            subTitle="Small section heading."
            Icon={Heading3}
          />
          <BlockButton
            type="bulleted-list"
            title="Bulleted List"
            subTitle="Create a simple bulleted list."
            Icon={List}
          />
          <BlockButton
            type="numbered-list"
            title="Numbered List"
            subTitle="Create a list with numbering."
            Icon={ListOrdered}
          />
          <BlockButton
            type="block-quote"
            title="Qoute"
            subTitle="Capture a quote."
            Icon={Quote}
          />
        </Toolbar>
      )}
      <MemoEditable
        editor={editor}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        setIsMenuOpen={setIsMenuOpen}
      />
    </Slate>
  );
};

type MemoEditableProps = {
  editor: Editor;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
};

const MemoEditable = memo(
  ({ editor, renderElement, renderLeaf, setIsMenuOpen }: MemoEditableProps) => {
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
          if (isHotkey("mod+/", e)) {
            setIsMenuOpen(true);
          }
          if (isHotkey("Escape", e)) {
            setIsMenuOpen(false);
          }
        }}
      />
    );
  }
);

type TextType = keyof Omit<CustomText, "text">;

const isMarkActive = (editor: Editor, textType: TextType) => {
  const marks = Editor.marks(editor);
  return marks ? marks[textType] === true : false;
};

const toggleMark = (editor: Editor, textType: TextType) => {
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

const toggleBlock = (editor: Editor, type: CustomElement["type"]) => {
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
        <Icon className="h-4 w-4 stroke-gray-800 stroke-2" />
      </Button>
    );
  }
);

const BlockButton = ({
  type,
  title,
  subTitle,
  Icon,
}: {
  type: CustomElement["type"];
  title: string;
  subTitle: string;
  Icon: LucideIcon;
}) => {
  const editor = useSlate();
  return (
    <Button
      className="group flex gap-2 px-3 py-1 transition-colors duration-200 hover:bg-gray-100"
      active={isBlockActive(
        editor,
        type,
        TEXT_ALIGN_TYPES.includes(type) ? "align" : "type"
      )}
      onMouseDown={(e: MouseEvent) => {
        e.preventDefault();
        toggleBlock(editor, type);
      }}
    >
      <div className="m-auto rounded-lg border border-gray-900/25 transition-colors duration-200 group-hover:bg-white">
        <Icon className="h-12 w-12 stroke-gray-700 p-2" />
      </div>
      <div className="flex flex-1 flex-col items-start justify-center">
        <h3 className="text-sm font-medium text-gray-900/80">{title}</h3>
        <span className="text-xs font-light text-gray-900/60">{subTitle}</span>
      </div>
    </Button>
  );
};

type BaseProps = {
  className: string;
  children: ReactNode;
  active: boolean;
  [key: string]: unknown;
};

const Toolbar = memo(
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

const Button = memo(
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

const Menu = forwardRef(
  ({ className, children, ...props }: BaseProps, ref: Ref<HTMLDivElement>) => (
    <div className={className} {...props} ref={ref}>
      {children}
    </div>
  )
);
