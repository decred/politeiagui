import React from "react";
import * as Showdown from "showdown";

const MarkdownRenderer = ({ body, className, showdownOptions }) => {
  const converter = new Showdown.Converter(showdownOptions || undefined);
  const html = converter.makeHtml(body) || "<p>&nbsp</p>";
  return (
    <div className={className}>
      <div className="md" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default MarkdownRenderer;
