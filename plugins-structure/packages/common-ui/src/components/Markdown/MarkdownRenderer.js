import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { customRenderers } from "./helpers";
import "./styles.css";

export function MarkdownRenderer({
  body,
  className,
  renderImages = true,
  isDiff,
  disallowedElements,
}) {
  return (
    <div className={className} data-testid="markdown-renderer">
      <ReactMarkdown
        className={classNames("markdown-body", isDiff && "markdown-diff")}
        skipHtml={true}
        unwrapDisallowed={true}
        remarkPlugins={[gfm]}
        components={customRenderers(renderImages, isDiff)}
        disallowedElements={disallowedElements}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

MarkdownRenderer.propTypes = {
  body: PropTypes.string,
  className: PropTypes.string,
  renderImages: PropTypes.bool,
  isDiff: PropTypes.bool,
  disallowedElements: PropTypes.arrayOf(PropTypes.string),
};
