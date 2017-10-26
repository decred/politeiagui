import React from "react";
import Snudownd from "../../snudownd";
const parser = Snudownd.getParser();

const MarkdownRenderer = ({ body }) => (
  <div className="md" dangerouslySetInnerHTML={{__html: parser.render(body || "")}} />
);

export default MarkdownRenderer;
