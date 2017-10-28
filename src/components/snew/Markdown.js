import React from "react";
import Snudownd from "snuownd";
const parser = Snudownd.getParser();

const MarkdownRenderer = ({ body, className }) => (
  <div className={className}>
    <div className="md" dangerouslySetInnerHTML={{__html: parser.render(body || "")}} />
  </div>
);

export default MarkdownRenderer;
