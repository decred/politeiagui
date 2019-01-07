import React from "react";
import PropTypes from "prop-types";
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
  onToggleFilesDiff
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
              {filesDiff ? "Text" : "Files"}
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
// const FilesDiff = ({ oldFiles, newFiles }) => {
//   const filesDiff = [];
//   const hasFile = (file, items) =>
//     items.filter(f => f.name === file.name && f.payload === file.payload)
//       .length > 0;
//   oldFiles.forEach(file => {
//     if (!hasFile(file, newFiles)) file.removed = true;
//     filesDiff.push(file);
//   });
//   newFiles.forEach(file => {
//     if (!hasFile(file, filesDiff)) {
//       file.added = true;
//       filesDiff.push(file);
//     }
//   });
//   return <ProposalImages files={filesDiff} readOnly={true} />;
// };

const withDiffStyle = {
  paddingTop: "80px",
  zIndex: 9999
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
      newFiles,
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
            onToggleFilesDiff={this.handleToggleFilesDiff}
            enableFilesDiff={newFiles.length}
          />
          {error ? (
            <Message body={error} type="error" />
          ) : filesDiff ? (
            <ProposalImages files={newFiles} readOnly={true} />
          ) : (
            <MarkdownRenderer
              body={newProposal}
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
