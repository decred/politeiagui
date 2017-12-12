import React from "react";
import Snudownd from "snuownd";
import ReactMarkdown from 'react-markdown';
const parser = Snudownd.getParser();

const MarkdownRenderer = ({ body, className }) => (
  <div className={className}>
    <ReactMarkdown className="md" source={body}/>
  </div>
);

export default MarkdownRenderer;
