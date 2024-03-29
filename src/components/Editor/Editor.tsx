/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import type { Note } from "@prisma/client";
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
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { toast } from "react-hot-toast";
import type { Descendant } from "slate";
import {
  Editor,
  Element as SlateElement,
  Transforms,
  createEditor,
  type BaseEditor,
  type BasePoint,
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
import { api } from "~/utils/api";
import { RenderElement, RenderLeaf } from "./Renders";
import { MenuAI } from "./ToolbarAI";

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

const marksDetails = [
  {
    type: "bold",
    Icon: Bold,
  },
  {
    type: "italic",
    Icon: Italic,
  },
  {
    type: "underline",
    Icon: Underline,
  },
  {
    type: "strikethrough",
    Icon: Strikethrough,
  },
  {
    type: "code",
    Icon: Code,
  },
] as const;

const blockDetails = [
  {
    type: "paragraph",
    title: "Text",
    subTitle: "Just start writing with plain text.",
    Icon: Type,
  },
  {
    type: "heading-one",
    title: "Heading 1",
    subTitle: "Big section heading.",
    Icon: Heading1,
  },
  {
    type: "heading-two",
    title: "Heading 2",
    subTitle: "Medium section heading.",
    Icon: Heading2,
  },
  {
    type: "heading-three",
    title: "Heading 3",
    subTitle: "Small section heading.",
    Icon: Heading3,
  },
  {
    type: "bulleted-list",
    title: "Bulleted List",
    subTitle: "Create a simple bulleted list.",
    Icon: List,
  },
  {
    type: "block-quote",
    title: "Quote",
    subTitle: "Capture a quote.",
    Icon: Quote,
  },
] as const

export const SlateEditor = ({
  data,
  isLoading,
}: {
  data: { note: Note; content: unknown } | undefined;
  isLoading: boolean;
}) => {
  const selection = useSelection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAIMenuOpen, setIsAIMenuOpen] = useState(false);
  const [body, setBody] = useState<Descendant[]>([]);
  const [anchor, setAnchor] = useState<BasePoint | undefined>(undefined);
  const { mutate } = api.note.updateNoteBody.useMutation({
    retry: false,
    onSuccess() {
      toast.success(`Successfully update`);
    },
    onError() {
      toast.error("Updating didn't work.");
    },
  });

  const renderElement = useCallback(
    (props: RenderElementProps) => <RenderElement {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <RenderLeaf {...props} />,
    []
  );

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleBodyUpdate = (content: Descendant[]) => {
    if (!data || !data.note?.id || !data.content) return;

    mutate({ id: data.note.id, content });
  };

  const memoizedBody = useMemo(() => body, [body]);

  useEffect(() => {
    const id = setTimeout(() => {
      handleBodyUpdate(memoizedBody);
    }, 1200);
    return () => clearTimeout(id);
  }, [memoizedBody]);

  if (isLoading) {
    return <div className="skeleton h-8 w-full rounded-2xl " />;
  }

  return (
    <Slate
      editor={editor}
      value={data?.content as Descendant[]}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          // Save the value to Local Storage.
          setBody(value);
        }
      }}
    >
      {/* 
        TODO: Toolbar only available when text highlighted. ✅ DONE
        TODO: takes the editor.selection and style his position with offset: number and path [number, number] ✅
        TODO: also takes the highlighted selection and transformed depending on option choosed. ✅ DONE
        TODO: the only way to make toolbar dissapear is by move cursor of selecting text or click outside toolbar. ✅ DONE
      */}
      {selection && (
        <Toolbar
          style={{
            position: "absolute",
            left: `${(anchor?.offset ?? 0) * 6 + 360}px`,
            top: `${(anchor?.path[0] ?? 0) * 25 + 380}px`, // 2 * 440px perfect point
          }}
          className="z-50 flex w-fit items-center overflow-hidden rounded-lg border  border-gray-900/5 bg-white shadow-sm shadow-gray-300 transition-all duration-200"
        >
          {marksDetails.map((mark) => (
            <MarkButton key={mark.type} type={mark.type} Icon={mark.Icon} />
          ))}
        </Toolbar>
      )}
      {isMenuOpen && (
        <Toolbar
          style={{
            position: "absolute",
            left: `${(anchor?.offset ?? 0) * 6 + 360}px`,
            top: `${(anchor?.path[0] ?? 0) * 25 + 380}px`,
          }}
          className="z-50 flex max-h-[400px] w-fit flex-col overflow-y-scroll scroll-smooth rounded-lg border border-gray-900/5 bg-white p-1 shadow-sm shadow-gray-300 transition-all duration-200"
        >
          {blockDetails.map(block => (
            <BlockOption
            key={block.type}
              type={block.type}
              title={block.title}
              subTitle={block.subTitle}
              Icon={block.Icon}
              setIsMenuOpen={setIsMenuOpen}
            />
          ))}
        </Toolbar>
      )}
      {isAIMenuOpen && (
        <MenuAI
          style={{
            position: "absolute",
            left: `${(anchor?.offset ?? 0) * 6 + 360}px`,
            top: `${(anchor?.path[0] ?? 0) * 25 + 380}px`,
          }}
          setIsAIMenuOpen={setIsAIMenuOpen}
        />
      )}
      <MemoEditable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        setIsMenuOpen={setIsMenuOpen}
        setIsAIMenuOpen={setIsAIMenuOpen}
        setAnchor={setAnchor}
      />
    </Slate>
  );
};

type MemoEditableProps = {
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  setIsAIMenuOpen: (isAIMenuOpen: boolean) => void;
  setAnchor: (anchor: BasePoint | undefined) => void;
};

const MemoEditable = memo(
  ({
    renderElement,
    renderLeaf,
    setIsMenuOpen,
    setIsAIMenuOpen,
    setAnchor,
  }: MemoEditableProps) => {
    const editor = useSlate();
    return (
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        spellCheck
        autoFocus
        placeholder="Press command or ctrl + `i` for AI, command or ctrl + '/' for block actions..."
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
            setIsAIMenuOpen(false);
          }
          if (isHotkey("mod+i", e)) {
            setIsAIMenuOpen(true);
          }
          setAnchor(editor.selection?.anchor);
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
      <button
        className="h-full w-full border-gray-500/5 px-2 py-2 transition-all duration-100 hover:border-x-2 hover:bg-gray-200"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, type);
        }}
      >
        <Icon className="h-4 w-4 stroke-gray-800 stroke-2" />
      </button>
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
    <button
      className="button-block group gap-1 rounded-lg px-3 py-1 text-left transition-colors duration-200 hover:bg-gray-100"
      onClick={(e) => {
        e.preventDefault();
        toggleBlock(editor, type);
        setIsMenuOpen(false);
      }}
    >
      <Icon className="icon my-auto h-16 w-16 rounded-lg border border-gray-900/25 stroke-gray-700 p-4 transition-colors duration-200 group-hover:bg-white" />
      <span className="mt-auto text-sm font-medium text-gray-900/80">
        {title}
      </span>
      <span className="text-xs font-light text-gray-900/60">{subTitle}</span>
    </button>
  );
};

type BaseProps = {
  className: string;
  children: ReactNode;
  style: CSSProperties;
  active?: boolean;
  [key: string]: unknown;
};

// TODO: Convert these components to custom Slate components with the useSlate() hook.
// This hook render those components when ever the editor changes
// https://docs.slatejs.org/concepts/09-rendering#toolbars-menus-overlays-and-more

const Toolbar = memo(
  forwardRef(
    (
      { className, children, style, ...props }: BaseProps,
      ref: Ref<HTMLDivElement>
    ) => (
      <div style={style} className={className} {...props} ref={ref}>
        {children}
      </div>
    )
  )
);