import type { CSSProperties } from "react";
import { type RenderElementProps, type RenderLeafProps } from "slate-react";

export const RenderElement = ({
  element,
  attributes,
  children,
}: RenderElementProps) => {
  let style: CSSProperties = {
    display: "inline-block",
    fontSize: "1rem",
    lineHeight: "1rem",
    backgroundColor: "transparent",
    borderLeft: 0,
    margin: 0,
    padding: 0,
    quotes: "none",
  };

  switch (element.type) {
    case "block-quote":
      style = {
        display: "inline-block",
        fontSize: "1rem",
        lineHeight: "1rem",
        backgroundColor: "#f9f9f9",
        borderLeft: "10px solid #ccc",
        margin: "1.5em 10px",
        padding: "0.5em 10px",
        quotes: `"\x811D""\x8118""\x8119"`,
      };
      break;

    case "bulleted-list":
      style = {
        display: "list-item",
        fontSize: "1rem",
        lineHeight: "1rem",
        backgroundColor: "transparent",
        borderLeft: 0,
        margin: 0,
        padding: 0,
        quotes: "none",
      };
      break;

    case "heading-one":
      style = {
        display: "inline-block",
        fontSize: "1.875rem",
        lineHeight: "2.25rem",
        backgroundColor: "transparent",
        borderLeft: 0,
        margin: 0,
        padding: 0,
        quotes: "none",
      };
      break;

    case "heading-two":
      style = {
        display: "inline-block",
        fontSize: "1.5rem",
        lineHeight: "2rem",
        backgroundColor: "transparent",
        borderLeft: 0,
        margin: 0,
        padding: 0,
        quotes: "none",
      };
      break;

    case "heading-three":
      style = {
        display: "inline-block",
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
        backgroundColor: "transparent",
        borderLeft: 0,
        margin: 0,
        padding: 0,
        quotes: "none",
      };
      break;
  }
  return (
    <div style={style} {...attributes}>
      {children}
    </div>
  );

  // switch (element.type) {
  //   case "block-quote":
  //     return <blockquote {...attributes}>{children}</blockquote>;

  //   case "bulleted-list":
  //     return <ul {...attributes}>{children}</ul>;

  //   case "heading-one":
  //     return <h1 {...attributes}>{children}</h1>;

  //   case "heading-two":
  //     return <h2 {...attributes}>{children}</h2>;
  
  //   case "heading-three":
  //     return <h3 {...attributes}>{children}</h3>;
  
      // case 'list-item':
        //   return (
        //     <li style={style} {...attributes}>
        //       {children}
        //     </li>
        //   )
        // case 'numbered-list':
        //   return (
        //     <ol style={style} {...attributes}>
        //       {children}
        //     </ol>
        //   )

  //   default:
  //     return <p {...attributes}>{children}</p>;
  // }

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
