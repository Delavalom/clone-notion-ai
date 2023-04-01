import { type RenderElementProps, type RenderLeafProps } from "slate-react";

export const RenderElement = ({
  element,
  attributes,
  children,
}: RenderElementProps) => {
  let className: string;
  switch (element.type) {
    case "block-quote":
      className = "blockquote";
      break;

    case "bulleted-list":
      className = "list-item";
      break;

    case "heading-one":
      className = "text-3xl";
      break;

    case "heading-two":
      className = "text-2xl";
      break;

    case "heading-three":
      className = "text-xl";
      break;

    default:
      className = "";
      break;
  }
  return (
    <div className={className} {...attributes}>
      {children}
    </div>
  );
};

export const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  // Edit this to a React.cssProperties Object and toggle active properties and inactive properties
  let className: string

  if (leaf.bold) {
    className = "font-bold";
  } else if (leaf.code) {
    className = "bg-gray-300";
  } else if (leaf.italic) {
    className = "italic";
  } else if (leaf.underline) {
    className = "underline";
  } else if (leaf.strikethrough) {
    className = "line-through";
  } else {
    className = "";
  }

  return (
    <div className={className} {...attributes}>
      {children}
    </div>
  );
};
