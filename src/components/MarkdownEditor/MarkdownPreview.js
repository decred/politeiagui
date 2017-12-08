import React from "react";
import PropTypes from "prop-types";
import MarkdownHelp from "./MarkdownHelp";
import Markdown from "../snew/Markdown";

const MarkdownPreview = ({body, showdownOptions}) => (
  <div className="mde-preview">
    <Markdown className="mde-preview-content" showdownOptions={showdownOptions} body={body} />
    <div className="mde-help">
      <MarkdownHelp />
    </div>
  </div>
);

MarkdownPreview.propTypes = {
  body: PropTypes.string.isRequired
};

export default MarkdownPreview;
