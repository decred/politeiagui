import React from "react";
import ReactMarkdown from "react-markdown";

const Markdown = ({ body, className="usertext usertext-body may-black-within md-container" }) =>
  body ? (
    <div className={className}>
      <ReactMarkdown source={body} className="md" />
    </div>
  ) : null;

export default Markdown;


