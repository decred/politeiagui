import React from "react";
import ReactMarkdown from "react-markdown";

const customRenderers = {
  image: ({src, alt}) => {
    return <a rel="nofollow" href={src}>{alt}</a>;
  },
  link: ({href, children}) => {
    return <a rel="nofollow" href={href}>{children[0]}</a>;
  }
};

const MarkdownRenderer = ({ body, className }) => (
  <div className={className} style={{ overflowX: "hidden" }}>
    <ReactMarkdown
      className="md"
      renderers={customRenderers}
      source={body}
    />
  </div>
);

export default MarkdownRenderer;
