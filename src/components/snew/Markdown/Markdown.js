import React from "react";
import ReactMarkdown from "react-markdown";
import { customRenderers, testLink } from "./helpers";
import modalConnector from "../../../connectors/modal";


const MarkdownRenderer = ({
  body,
  className,
  confirmWithModal,
  filterXss = true,
  displayExternalLikWarning = true
}) => {
  const allowNode = (args) => {
    if (args.type === "link") {
      return testLink(args.url, confirmWithModal);
    }
    return true;
  };
  return (
    <div className={className}>
      <ReactMarkdown
        className="md"
        renderers={customRenderers(filterXss, displayExternalLikWarning && confirmWithModal)}
        allowNode={allowNode}
        source={body}
      />
    </div>
  );
};

export default modalConnector(MarkdownRenderer);
