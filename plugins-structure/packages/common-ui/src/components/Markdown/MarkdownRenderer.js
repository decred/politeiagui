import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { customRenderers } from "./helpers";
import "./styles.css";

export const MarkdownRenderer = ({
  body,
  className,
  renderImages = true,
  isDiff,
  disallowedElements,
}) => (
  <div className={className} data-testid="markdown-renderer">
    <ReactMarkdown
      className={classNames("markdown-body", isDiff && "markdown-diff")}
      skipHtml={true}
      unwrapDisallowed={true}
      remarkPlugins={[gfm]}
      components={customRenderers(renderImages)}
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
  escapeHtml: PropTypes.bool,
};
