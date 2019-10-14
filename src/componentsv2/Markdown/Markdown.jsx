import React from "react";
import PropTypes from "prop-types";
import MarkdownToJsx from "markdown-to-jsx";
import { rootHandler } from "./helpers";
import "./styles.css";

const MarkdownRenderer = ({
  body,
  className,
  filterXss = true,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      <div className="markdown-body">
        <MarkdownToJsx
          options={{
            createElement: rootHandler(filterXss)
          }}
        >
          {body}
        </MarkdownToJsx>
      </div>
    </div>
  );
};

MarkdownRenderer.prototype = {
  body: PropTypes.string,
  className: PropTypes.string,
  confirmWithModal: PropTypes.bool,
  filterXss: PropTypes.bool,
  displayExternalLikWarning: PropTypes.bool
  // escapeHtml: PropTypes.bool
};

export default MarkdownRenderer;
