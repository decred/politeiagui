import React from "react";
import PropTypes from "prop-types";
import MarkdownHelp from "./MarkdownHelp";
import Markdown from "../snew/Markdown";

const MarkdownPreview = ({ body }) => (
  <div className="mde-preview">
    <Markdown body={body} className="mde-preview-content"/>
    <div className="mde-help">
      <MarkdownHelp />
    </div>
  </div>
);

MarkdownPreview.propTypes = {
  body: PropTypes.string.isRequired
};

export default MarkdownPreview;