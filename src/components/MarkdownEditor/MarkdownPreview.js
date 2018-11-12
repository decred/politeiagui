import React from "react";
import PropTypes from "prop-types";
import Markdown from "../snew/Markdown";

const MarkdownPreview = ({ body, fullWidth }) => (
  <div className={`mde-preview ${fullWidth && "fullwidth"}`}>
    <Markdown body={body} className="mde-preview-content" />
  </div>
);

MarkdownPreview.propTypes = {
  body: PropTypes.string.isRequired
};

export default MarkdownPreview;
