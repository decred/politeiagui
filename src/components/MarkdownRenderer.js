import React from "react";
import ReactMarkdown from "react-markdown";

const MarkdownRenderer = ({ value }) => (
  <ReactMarkdown source={value} />
);

export default MarkdownRenderer;
