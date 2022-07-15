import React from "react";
import PropTypes from "prop-types";
import { insertDiffHTML } from "./helpers";
import Message from "../../Message";
import ProposalImages from "../../ProposalImages";
import MarkdownRenderer from "./Markdown";

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
              {filesDiff ? "Text Changes" : "Attachments changes"}
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

const DiffBody = ({
  body,
  proposal,
  onToggleTextDiffPreview,
  preview,
  version
}) => (
  <div>
    <div className="diff-text-preview-toggle" onClick={onToggleTextDiffPreview}>
      <div
        className={!preview ? "diff-active-toggle" : ""}
        onClick={!preview ? onToggleTextDiffPreview : null}
      >
        View version {version}
      </div>
      <div
        className={preview ? "diff-active-toggle" : ""}
        onClick={preview ? onToggleTextDiffPreview : null}
      >
        Text changes
      </div>
    </div>
    <div style={{ padding: "16px" }}>
      {preview ? (
        <div className="md">{body}</div>
      ) : (
        <MarkdownRenderer body={proposal} />
      )}
    </div>
  </div>
);

const getFilesDiff = (newFiles, oldFiles, filesDiffFunc) => [
  ...newFiles.filter(filesDiffFunc(oldFiles)).map(markAsAdded),
  ...oldFiles.filter(filesDiffFunc(newFiles)).map(markAsRemoved),
  ...newFiles.filter(filesEqFunc(oldFiles)) // for unchanged files
];

const markAsAdded = (elem) => ({ ...elem, added: true });
const markAsRemoved = (elem) => ({ ...elem, removed: true });
const filesDiffFunc = (arr) => (elem) =>
  !arr.some(
    (arrelem) => arrelem.name === elem.name && arrelem.payload === elem.payload
  );
const filesEqFunc = (arr) => (elem) => !filesDiffFunc(arr)(elem);
// This function allows us to know if the file has changed or not, in order to display the red dot
// to indicate the Files Diff
const hasFilesChanged = (filesDiff) =>
  filesDiff.length > 0 &&
  filesDiff.filter((file) => file.added || file.removed).length > 0;

const withDiffStyle = {
  zIndex: 9999,
  minWidth: "800px",
  margin: "0px 1px"
};

class Diff extends React.Component {
  state = { filesDiff: false, textDiffPreview: false };
  handleToggleFilesDiff = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      filesDiff: !state.filesDiff
    }));
  };
  handleToggleTextDiffPreview = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      textDiffPreview: !state.textDiffPreview
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
    const { filesDiff, textDiffPreview } = this.state;
    const filesDiffArray = getFilesDiff(newFiles, oldFiles, filesDiffFunc);
    const hasFileChanged = hasFilesChanged(filesDiffArray);
    return (
      // It is not necessary to use another Modal component here, since we already call the openModal function on
      // the parent component
      <div className="modal-content" style={withDiffStyle}>
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
            <DiffBody
              body={insertDiffHTML(oldProposal, newProposal)}
              proposal={newProposal}
              onToggleTextDiffPreview={this.handleToggleTextDiffPreview}
              preview={textDiffPreview}
              version={version}
            />
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
