import React from "react";
import PropTypes from "prop-types";
import { insertDiffHTML } from "./helpers";
import MarkdownRenderer from "./Markdown";
import Modal from "../../Modal/Modal";
import Message from "../../Message";
import ProposalImages from "../../ProposalImages";

const DiffHeader = ({
  userName,
  title,
  version,
  lastEdition,
  onClose,
  loading,
  enableFilesDiff,
  filesDiff,
  onToggleFilesDiff,
  isNewFile
}) => (
  <div className="diff-header">
    {loading ? (
      <span>Fetching proposal...</span>
    ) : (
      <React.Fragment>
        <span>
          {userName && lastEdition && version && title
            ? `${userName} ${lastEdition} - version ${version} - ${title}`
            : ""}
        </span>
        <div>
          {enableFilesDiff ? (
            <span
              className="linkish"
              style={{ marginRight: "10px" }}
              onClick={onToggleFilesDiff}
              href=""
            >
              {filesDiff ? "Text Diff" : "Files Diff"}
              {isNewFile ? <span className="new-file-indicator" /> : null}
            </span>
          ) : null}
          <span onClick={onClose} style={{ cursor: "pointer" }}>
            ✖
          </span>
        </div>
      </React.Fragment>
    )}
  </div>
);

/** TODO: use files diff component when diff implementation is polished  */
const FilesDiff = ({ oldFiles, newFiles }) => {
  const filesDiff = [];
  const hasFile = (file, items) =>
    items.filter(f => f.name === file.name && f.payload === file.payload)
      .length > 0;
  oldFiles.forEach(file => {
    if (!hasFile(file, newFiles)) file.removed = true;
    filesDiff.push(file);
  });
  newFiles.forEach(file => {
    if (!hasFile(file, filesDiff)) {
      file.added = true;
      filesDiff.push(file);
    }
  });
  return <ProposalImages files={filesDiff} readOnly={true} />;
};

const withDiffStyle = {
  paddingTop: "80px",
  zIndex: 9999
};

const hasFileChanged = (oldFiles, newFiles) => {
  const hasFile = (file, items) =>
    items.filter(f => f.name === file.name && f.payload === file.payload)
      .length > 0;
  for (let i = 0; i < oldFiles.length; i++) {
    if (!hasFile(oldFiles[i], newFiles)) {
      return true;
    }
  }
  for (let i = 0; i < newFiles.length; i++) {
    if (!hasFile(newFiles[i], oldFiles)) {
      return true;
    }
  }
  return false;
};

class Diff extends React.Component {
  state = { filesDiff: false };
  handleToggleFilesDiff = e => {
    e.preventDefault();
    this.setState(state => ({
      filesDiff: !state.filesDiff
    }));
  };
  render() {
    const {
      newProposal,
      oldProposal,
      newFiles,
      oldFiles,
      title,
      version,
      userName,
      lastEdition,
      onClose,
      loading,
      error
    } = this.props;
    const { filesDiff } = this.state;
    return (
      <Modal style={withDiffStyle} onClose={onClose}>
        <div className="diff-wrapper">
          <DiffHeader
            title={title}
            version={version}
            loading={loading}
            userName={userName}
            lastEdition={lastEdition}
            onClose={onClose}
            filesDiff={filesDiff}
            isNewFile={hasFileChanged(oldFiles, newFiles)}
            onToggleFilesDiff={this.handleToggleFilesDiff}
            enableFilesDiff={oldFiles.length || newFiles.length}
          />
          {error ? (
            <Message body={error} type="error" />
          ) : filesDiff ? (
            <FilesDiff oldFiles={oldFiles} newFiles={newFiles} />
          ) : (
            <MarkdownRenderer
              body={insertDiffHTML(oldProposal, newProposal)}
              style={{ padding: "16px" }}
              scapeHtml={false}
            />
          )}
        </div>
      </Modal>
    );
  }
}

Diff.propTypes = {
  lastEdition: PropTypes.string,
  newProposal: PropTypes.string,
  oldProposal: PropTypes.string,
  oldFiles: PropTypes.array,
  newFiles: PropTypes.array,
  title: PropTypes.string,
  version: PropTypes.string,
  onClose: PropTypes.func,
  userName: PropTypes.string,
  loading: PropTypes.bool
};

export default Diff;
