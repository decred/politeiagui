import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { customComponents } from "./helpers";
import "./styles.css";

const MarkdownRenderer = ({
  body,
  className,
  renderImages = true,
  disallowedElements,
  ...props
}) => (
  <div className={className} {...props} data-testid="markdown-wrapper">
    <ReactMarkdown
      className="markdown-body"
      skipHtml={true}
      unwrapDisallowed={true}
      remarkPlugins={[gfm]}
      components={customComponents(renderImages)}
      disallowedElements={disallowedElements}
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
  escapeHtml: PropTypes.bool
};

export default React.memo(MarkdownRenderer);
