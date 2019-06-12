import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { customRenderers, htmlParserRules } from "./helpers";
import "./styles.css";

const MarkdownRenderer = ({
  body,
  className,
  style,
  filterXss = true,
  scapeHtml = true
}) => (
  <div className={className} style={style}>
    <ReactMarkdown
      className="markdown-body"
      escapeHtml={scapeHtml}
      astPlugins={[htmlParserRules]}
      renderers={customRenderers(filterXss)}
      source={body}
    />
  </div>
);

MarkdownRenderer.prototype = {
  body: PropTypes.string,
  className: PropTypes.string,
  confirmWithModal: PropTypes.bool,
  style: PropTypes.object,
  filterXss: PropTypes.bool,
  displayExternalLikWarning: PropTypes.bool,
  scapeHtml: PropTypes.bool
};

export default MarkdownRenderer;
