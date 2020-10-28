import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { customRenderers, htmlParserRules } from "./helpers";
import "./styles.css";

const MarkdownRenderer = ({
  body,
  className,
  renderImages = true,
  escapeHtml = true,
  ...props
}) => (
  <div className={className} {...props}>
    <ReactMarkdown
      className="markdown-body"
      escapeHtml={escapeHtml}
      astPlugins={[htmlParserRules]}
      renderers={customRenderers(renderImages)}
      source={body}
    />
  </div>
);

MarkdownRenderer.prototype = {
  body: PropTypes.string,
  className: PropTypes.string,
  confirmWithModal: PropTypes.bool,
  renderImages: PropTypes.bool,
  displayExternalLikWarning: PropTypes.bool,
  escapeHtml: PropTypes.bool
};

export default React.memo(MarkdownRenderer);
