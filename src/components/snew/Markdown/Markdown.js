import React from "react";
import ReactMarkdown from "react-markdown";
import { customRenderers } from "./helpers";


const MarkdownRenderer = ({ body, className, filterXss = true }) => (
  <div className={className}>
    <ReactMarkdown
      className="md"
      renderers={customRenderers(filterXss)}
      source={body}
    />
  </div>
);

export default MarkdownRenderer;
