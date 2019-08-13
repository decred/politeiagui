import React from "react";
// import { classNames } from "pi-ui";
import PropTypes from "prop-types";
// import ReactMarkdown from "react-markdown";
import MarkdownToJsx from "markdown-to-jsx";
// import { customRenderers, htmlParserRules } from "./helpers";
import { rootHandler } from "./helpers";
import "./styles.css";

const MarkdownRenderer = ({
  body,
  className,
  filterXss = true,
  // escapeHtml = false,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {/* <ReactMarkdown
        className="markdown-body"
        escapeHtml={escapeHtml}
        astPlugins={[htmlParserRules]}
        renderers={customRenderers(filterXss)}
        source={body}
      /> */}
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
