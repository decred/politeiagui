import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { customRenderers } from "./helpers";
import "./styles.css";

export const MarkdownRenderer = React.memo(
  ({ body, className, renderImages = true, filterUrl = false, ...props }) => (
    <div className={className} {...props}>
      <ReactMarkdown
        className="markdown-body"
        components={customRenderers(renderImages, filterUrl)}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
);

MarkdownRenderer.prototype = {
  body: PropTypes.string,
  className: PropTypes.string,
  confirmWithModal: PropTypes.bool,
  renderImages: PropTypes.bool,
  displayExternalLikWarning: PropTypes.bool,
  escapeHtml: PropTypes.bool,
};
