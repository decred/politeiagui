import React from "react";
import ReactMarkdown from "react-markdown";
import { customRenderers } from "./helpers";
import modalConnector from "../../../connectors/modal";

const MarkdownRenderer = ({
  body,
  className,
  confirmWithModal,
  filterXss = true,
  displayExternalLikWarning = true
}) => (
  <div className={className}>
    <ReactMarkdown
      className="md"
      renderers={customRenderers(
        filterXss,
        displayExternalLikWarning && confirmWithModal
      )}
      source={body}
    />
  </div>
);

export default modalConnector(MarkdownRenderer);
