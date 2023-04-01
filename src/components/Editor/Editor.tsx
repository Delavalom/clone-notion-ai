/* eslint-disable react/display-name */
import isHotkey from "is-hotkey";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
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
  useState,
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
// add later the blockoptions for list-item and numbered-list

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+e": "code",
  "mod+s": "strikethrough",
} as const;

const initialValue: Descendant[] = [
  // these are the Nodes
  {
    // these are Elements
    type: "paragraph",
    children: [
      // these are Text
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
        TODO: Toolbar only available when text highlighted. ✅ DONE
        TODO: takes the editor.selection and style his position with offset: number and path [number, number]
        TODO: also takes the highlighted selection and transformed depending on option choosed. ✅ DONE
        TODO: the only way to make toolbar dissapear is by move cursor of selecting text or click outside toolbar. ✅ DONE
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
        <Toolbar className="relative flex max-h-[400px] w-fit flex-col overflow-y-scroll scroll-smooth rounded-lg border border-gray-900/5 p-1 shadow-lg shadow-gray-300 transition-all duration-200">
          <BlockOption
            type="paragraph"
            title="Text"
            subTitle="Just start writing with plain text."
            Icon={Type}
            setIsMenuOpen={setIsMenuOpen}
          />
          <BlockOption
            type="heading-one"
            title="Heading 1"
            subTitle="Big section heading."
            Icon={Heading1}
            setIsMenuOpen={setIsMenuOpen}
          />
          <BlockOption
            type="heading-two"
            title="Heading 2"
            subTitle="Medium section heading."
            Icon={Heading2}
            setIsMenuOpen={setIsMenuOpen}
          />
          <BlockOption
            type="heading-three"
            title="Heading 3"
            subTitle="Small section heading."
            Icon={Heading3}
            setIsMenuOpen={setIsMenuOpen}
          />
          <BlockOption
            type="bulleted-list"
            title="Bulleted List"
            subTitle="Create a simple bulleted list."
            Icon={List}
            setIsMenuOpen={setIsMenuOpen}
          />
          <BlockOption
            type="block-quote"
            title="Quote"
            subTitle="Capture a quote."
            Icon={Quote}
            setIsMenuOpen={setIsMenuOpen}
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
        spellCheck
        autoFocus
        onKeyDown={(e) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, e)) {
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

const isBlockActive = (editor: Editor, type: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n["type"] === type,
    })
  );

  return !!match;
};

const toggleBlock = (editor: Editor, type: CustomElement["type"]) => {
  const isActive = isBlockActive(editor, type);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n["type"] === "bulleted-list",
    split: true,
  });

  Transforms.setNodes<SlateElement>(editor, {
    type: isActive ? "paragraph" : type,
  });

  if (!isActive && type === "bulleted-list") {
    const block = {
      type,
      children: [],
    };
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

const BlockOption = ({
  type,
  title,
  subTitle,
  Icon,
  setIsMenuOpen,
}: {
  type: CustomElement["type"];
  title: string;
  subTitle: string;
  Icon: LucideIcon;
  setIsMenuOpen: (isModalOpen: boolean) => void;
}) => {
  const editor = useSlate();
  return (
    <Button
      className="button-block group gap-1 rounded-lg px-3 py-1 text-left transition-colors duration-200 hover:bg-gray-100"
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        toggleBlock(editor, type);
        setIsMenuOpen(false);
      }}
    >
      <Icon className="icon my-auto h-16 w-16 rounded-lg border border-gray-900/25 stroke-gray-700 p-4 transition-colors duration-200 group-hover:bg-white" />
      <Span className="mt-auto text-sm font-medium text-gray-900/80">
        {title}
      </Span>
      <Span className="text-xs font-light text-gray-900/60">{subTitle}</Span>
    </Button>
  );
};

type BaseProps = {
  className: string;
  children: ReactNode;
  active?: boolean;
  [key: string]: unknown;
};

// TODO: Convert these components to custom Slate components with the useSlate() hook.
// This hook render those components when ever the editor changes
// https://docs.slatejs.org/concepts/09-rendering#toolbars-menus-overlays-and-more

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
      <button
        tabIndex={0}
        {...props}
        ref={ref}
        style={{ color: active ? "blue" : "black" }}
      >
        {children}
      </button>
    )
  )
);

const Menu = memo(
  forwardRef(
    (
      { className, children, ...props }: BaseProps,
      ref: Ref<HTMLDivElement>
    ) => (
      <div className={className} {...props} ref={ref}>
        {children}
      </div>
    )
  )
);

const Span = memo(
  forwardRef(
    (
      { className, children, ...props }: BaseProps,
      ref: Ref<HTMLSpanElement>
    ) => (
      <span className={className} {...props} ref={ref}>
        {children}
      </span>
    )
  )
);
