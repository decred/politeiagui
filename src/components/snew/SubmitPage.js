import React from "react";
import ReactBody from "react-body";
import submitProposalConnector from "../../connectors/submitProposal";
import MarkdownEditorField from "../Form/Fields/MarkdownEditorField";
import FilesField from "../Form/Fields/FilesField";
import ErrorField from "../Form/Fields/ErrorField";
import InputFieldWithError from "../Form/Fields/InputFieldWithError";
import Message from "../Message";
import MultipleItemsBodyMessage from "../MultipleItemsBodyMessage";
import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";
import concat from "lodash/concat";
import cloneDeep from "lodash/cloneDeep";
import { Field } from "redux-form";
import MarkdownHelp from "../MarkdownHelp";
import { MANAGE_CREDITS_MODAL, ONBOARD } from "../Modal/modalTypes";

const normalizer = (value, previousValue) => {
  let files = [];

  if (previousValue && isArray(previousValue)) {
    files = cloneDeep(previousValue);
  }

  // Delete images
  if (!isUndefined(value.remove)) {
    files.splice(value.remove, 1);
  }

  // Add images
  if (isArray(value)) {
    files = concat(files, value);
  }

  return files;
};

class SubmitPage extends React.Component {
  render() {
    const {
      isLoading,
      PageLoadingIcon,
      policy,
      error,
      warning,
      onSave,
      onSaveDraft,
      submitting,
      handleSubmit,
      validationError,
      submitError,
      userCanExecuteActions,
      openModal,
      proposalCredits,
      editingMode
    } = this.props;
    console.log("new proposal error", submitError);
    const submitEnabled =
      !submitting &&
      !error &&
      !validationError &&
      userCanExecuteActions &&
      (proposalCredits > 0 || editingMode);
    return !policy || isLoading ? (
      <PageLoadingIcon />
    ) : (
      <div className="content" role="main">
        <div className="page submit-proposal-page">
          <ReactBody className="submit-page" />
          <div className="submit conztent warn-on-unload" id="newlink">
            {validationError && (
              <Message type="error" header="Error creating proposal">
                <MultipleItemsBodyMessage items={validationError} />
              </Message>
            )}
            {!error && warning && (
              <Message type="warn" header="Warning">
                <MultipleItemsBodyMessage items={warning} />
              </Message>
            )}
            <div className="formtabs-content">
              <div className="spacer">
                <Field
                  name="global"
                  component={props => (
                    <ErrorField title="Cannot submit proposal" {...props} />
                  )}
                />
                <div className="roundfield" id="title-field">
                  <div className="roundfield-content">
                    <div style={{ display: "flex", width: "100%" }}>
                      <Field
                        name="name"
                        component={InputFieldWithError}
                        tabIndex={1}
                        type="text"
                        placeholder="Proposal Name"
                      />
                      {editingMode ? (
                        <div
                          style={{
                            flex: "1",
                            display: "flex",
                            justifyContent: "flex-end"
                          }}
                        >
                          <span style={{ color: "#777" }}>
                            <i className="fa fa-edit right-margin-5" />
                            Editing
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <input name="kind" type="hidden" defaultValue="self" />
                    <div className="usertext">
                      <input name="thing_id" type="hidden" defaultValue />
                      <div className="usertext-edit md-container" style={{}}>
                        <div className="md">
                          <Field
                            name="description"
                            component={MarkdownEditorField}
                            tabIndex={2}
                            placeholder="Markdown Entry"
                            rows={20}
                            cols={80}
                          />
                          <a
                            className="linkish-modal"
                            onClick={() => openModal(ONBOARD, { tab: 4 })}
                          >
                            Learn How to Format your Proposal
                          </a>
                          <Field
                            name="files"
                            className="attach-button greenprimary"
                            component={FilesField}
                            userCanExecuteActions={userCanExecuteActions}
                            placeholder="Attach a file"
                            policy={policy}
                            normalize={normalizer}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="submit-wrapper">
                      <button
                        className={`togglebutton access-required${!submitEnabled &&
                          " not-active disabled"}`}
                        name="submit"
                        type="submit"
                        value="form"
                        onClick={handleSubmit(onSave)}
                      >
                        {!editingMode ? "submit" : "update"}
                      </button>
                      <button
                        className={"togglebutton secondary access-required"}
                        name="submit"
                        type="submit"
                        value="form"
                        onClick={handleSubmit(onSaveDraft)}
                      >
                        Save as Draft
                      </button>
                      {proposalCredits === 0 && !editingMode && (
                        <div className="submit-button-error">
                          To submit a proposal, you must purchase a proposal
                          credit.
                          <a
                            className="linkish"
                            onClick={() => openModal(MANAGE_CREDITS_MODAL)}
                          >
                            {" "}
                            Click here
                          </a>{" "}
                          to open the proposal credits manager.
                        </div>
                      )}
                      <p
                        style={{
                          fontSize: "16px",
                          display: "flex",
                          paddingTop: "1em"
                        }}
                      >
                        <b>NOTE:&nbsp;</b> Drafts are locally stored in the
                        browser and will NOT be available across different
                        browsers or devices.
                      </p>
                    </div>
                    {submitError ? (
                      <Message
                        type="error"
                        header={`Error ${
                          editingMode ? "updating" : "creating"
                        } proposal`}
                        body={submitError}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="spacer">
                <div className="roundfield">
                  <MarkdownHelp />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default submitProposalConnector(SubmitPage);
