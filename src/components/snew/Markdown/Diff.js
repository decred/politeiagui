import React from "react";
import PropTypes from "prop-types";
import { insertDiffHTML } from "./helpers";
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
              {isNewFile && <span className="new-file-indicator" />}
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

const DiffBody = ({ body }) => (
  <div className="md" style={{ padding: "16px" }}>
    {body}
  </div>
);

const getFilesDiff = (newFiles, oldFiles, filesDiffFunc) => [
  ...newFiles.filter(filesDiffFunc(oldFiles)).map(markAsAdded),
  ...oldFiles.filter(filesDiffFunc(newFiles)).map(markAsRemoved),
  ...newFiles.filter(filesEqFunc(oldFiles)) // for unchanged files
];

const markAsAdded = elem => ({ ...elem, added: true });
const markAsRemoved = elem => ({ ...elem, removed: true });
const filesDiffFunc = arr => elem =>
  !arr.some(
    arrelem => arrelem.name === elem.name && arrelem.payload === elem.payload
  );
const filesEqFunc = arr => elem => !filesDiffFunc(arr)(elem);
// This function allows us to know if the file has changed or not, in order to display the red dot
// to indicate the Files Diff
const hasFilesChanged = filesDiff =>
  filesDiff.length > 0 &&
  filesDiff.filter(file => file.added || file.removed).length > 0;

const withDiffStyle = {
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
    const filesDiffArray = getFilesDiff(newFiles, oldFiles, filesDiffFunc);
    const hasFileChanged = hasFilesChanged(filesDiffArray);
    return (
      // It is not necessary to use another Modal component here, since we already call the openModal function on
      // the parent component
      <div
        className="modal-content"
        style={{ minWidth: "700px", ...withDiffStyle }}
      >
        <div className="diff-wrapper">
          <DiffHeader
            title={title}
            version={version}
            loading={loading}
            userName={userName}
            lastEdition={lastEdition}
            onClose={onClose}
            filesDiff={filesDiff}
            isNewFile={hasFileChanged}
            onToggleFilesDiff={this.handleToggleFilesDiff}
            enableFilesDiff={oldFiles.length || newFiles.length}
          />
          {error ? (
            <Message body={error} type="error" />
          ) : filesDiff ? (
            <ProposalImages files={filesDiffArray} readOnly={true} />
          ) : (
            <DiffBody body={insertDiffHTML(oldProposal, newProposal)} />
          )}
        </div>
      </div>
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
