<<<<<<< HEAD
import React from "react";
import PropTypes from "prop-types";
import MarkdownHelp from "./MarkdownHelp";
import Markdown from "../snew/Markdown";
=======
import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../snew/Markdown';
>>>>>>> 1c51800... Move text preview next to the editor

const MarkdownPreview = ({ body }) => (
  <div className="mde-preview">
    <Markdown body={body} className="mde-preview-content"/>
  </div>
);

MarkdownPreview.propTypes = {
  body: PropTypes.string.isRequired
};

export default MarkdownPreview;