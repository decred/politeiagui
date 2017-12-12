import React from "react";
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ body, className }) => (
  <div className={className}>
    <ReactMarkdown className="md" source={body}/>
  </div>
);

export default MarkdownRenderer;
