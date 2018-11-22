import React from "react";
import PropTypes from "prop-types";
import { insertDiffHTML } from "./helpers";
import MarkdownRenderer from "./Markdown";
import Modal from "../../Modal/Modal";

const DiffHeader = ({ userName, lastEdition, onClose }) => (
  <div className="diff-header">
    <span>{`${userName} ${lastEdition}`}</span>
    <span onClick={onClose}>✖</span>
  </div>
);

const withDiffStyle = {
  paddingTop: "80px",
  zIndex: 9999
};

const Diff = ({ oldProposal, newProposal, userName, lastEdition, onClose }) => (
  <Modal style={withDiffStyle} onClose={onClose}>
    <div className="diff-wrapper">
      <DiffHeader
        userName={userName}
        lastEdition={lastEdition}
        onClose={onClose}
      />
      <MarkdownRenderer
        body={insertDiffHTML(oldProposal, newProposal)}
        style={{ padding: "16px" }}
        scapeHtml={false}
      />
    </div>
  </Modal>
);

Diff.PropTypes = {
  lastEdition: PropTypes.string,
  newProposal: PropTypes.string,
  oldProposal: PropTypes.string,
  onClose: PropTypes.func,
  userName: PropTypes.string
};

export default Diff;
