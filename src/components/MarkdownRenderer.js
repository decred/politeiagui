import React from "react";
import { Markdown } from "react-showdown";

const MarkdownRenderer = ({ value }) => (
  <Markdown markup={value} />
);

export default MarkdownRenderer;
