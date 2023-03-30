import { type RenderElementProps, type RenderLeafProps } from "slate-react";

export const RenderElement = ({
  element,
  attributes,
  children,
}: RenderElementProps) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;

    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;

    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;

    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;

    case "list-item":
      return <li {...attributes}>{children}</li>;

    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;

    default:
      return <p {...attributes}>{children}</p>;
  }
};

export const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code className="bg-gray-300">{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  return <span {...attributes}>{children}</span>;
};
