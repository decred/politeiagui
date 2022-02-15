import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { customRenderers } from "./helpers";
import "./styles.css";

export const MarkdownRenderer = ({ body, className, renderImages = true }) => (
  <div className={className} data-testid="markdown-renderer">
    <ReactMarkdown
      className="markdown-body"
      components={customRenderers(renderImages)}
    >
      {body}
    </ReactMarkdown>
  </div>
);

MarkdownRenderer.prototype = {
  body: PropTypes.string,
  className: PropTypes.string,
  confirmWithModal: PropTypes.bool,
  renderImages: PropTypes.bool,
  displayExternalLikWarning: PropTypes.bool,
  escapeHtml: PropTypes.bool,
};
