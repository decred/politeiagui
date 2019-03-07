import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { customRenderers, htmlParserRules } from "./helpers";
import modalConnector from "../../../connectors/modal";

const MarkdownRenderer = ({
  body,
  className,
  confirmWithModal,
  style,
  filterXss = true,
  displayExternalLikWarning = true,
  scapeHtml = true
}) => (
  <div className={className} style={style}>
    <ReactMarkdown
      className="md"
      escapeHtml={scapeHtml}
      astPlugins={[htmlParserRules]}
      renderers={customRenderers(
        filterXss,
        displayExternalLikWarning && confirmWithModal
      )}
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

export default modalConnector(MarkdownRenderer);
