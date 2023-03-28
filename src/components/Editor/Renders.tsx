import { type RenderElementProps, type RenderLeafProps } from "slate-react";

export const RenderElement = (props: RenderElementProps) => {
    switch (props.element.type) {
        case 'block-quote':
          return (
            <blockquote {...props.attributes}>
              {props.children}
            </blockquote>
          )
        case 'bulleted-list':
          return (
            <ul {...props.attributes}>
              {props.children}
            </ul>
          )
        case 'heading-one':
          return (
            <h1 {...props.attributes}>
              {props.children}
            </h1>
          )
        case 'heading-two':
          return (
            <h2 {...props.attributes}>
              {props.children}
            </h2>
          )
        case 'list-item':
          return (
            <li {...props.attributes}>
              {props.children}
            </li>
          )
        case 'numbered-list':
          return (
            <ol {...props.attributes}>
              {props.children}
            </ol>
          )
        default:
          return (
            <p {...props.attributes}>
              {props.children}
            </p>
          )
      }
};

export const RenderLeaf = (props: RenderLeafProps) => {
  let fontWeight = "normal";
  let fontStyle = "normal";
  let textDecoration = "none";

  if (props.leaf.type) {
    props.leaf.type.includes("bold") ? (fontWeight = "bold") : "normal";
    props.leaf.type.includes("italic") ? (fontStyle = "italic") : "normal";
    props.leaf.type.includes("line-through")
      ? (textDecoration = "line-through")
      : props.leaf.type.includes("underline")
      ? (textDecoration = "underline")
      : "none";
  }

  return (
    <span
      {...props.attributes}
      style={{
        fontWeight,
        fontStyle,
        textDecoration,
      }}
    >
      {props.children}
    </span>
  );
};
