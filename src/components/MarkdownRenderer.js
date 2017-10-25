import React from "react";
import Snudownd from "../snudownd";
const parser = Snudownd.getParser();

const MarkdownRenderer = ({ value }) => (
  <div className="md" dangerouslySetInnerHTML={{__html: parser.render(value || "")}} />
);

export default MarkdownRenderer;
