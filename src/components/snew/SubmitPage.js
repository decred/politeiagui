import React from "react";
import ReactBody from "react-body";
import submitFormHOC from "../../hocs/submitForm";
import MarkdownEditorField from "../Form/Fields/MarkdownEditorField";
import FilesField from "../Form/Fields/FilesField";
import ErrorField from "../Form/Fields/ErrorField";
import SelectField from "../Form/Fields/SelectField";
import TextAreaField from "../Form/Fields/TextAreaField";
import InputFieldWithError from "../Form/Fields/InputFieldWithError";
import Message from "../Message";
import MultipleItemsBodyMessage from "../MultipleItemsBodyMessage";
import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";
import concat from "lodash/concat";
import cloneDeep from "lodash/cloneDeep";
import { Field } from "redux-form";
import MarkdownHelp from "../MarkdownHelp";
import { MANAGE_CREDITS_MODAL } from "../Modal/modalTypes";
import { PROPOSAL_GUIDELINES } from "../../constants";

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

const ToggledMarkdown = props => (
  <MarkdownEditorField input={props.input} toggledStyle={true} />
);

const InvoiceSubmit = props => {
  const {
    isLoading,
    PageLoadingIcon,
    error,
    warning,
    onSave,
    submitting,
    handleSubmit,
    validationError,
    submitError,
    userCanExecuteActions,
    editingMode
  } = props;
  const submitEnabled =
    !submitting && !error && !validationError && userCanExecuteActions;
  return isLoading ? (
    <PageLoadingIcon />
  ) : (
    <div className="content" role="main">
      <div className="page submit-proposal-page">
        <ReactBody className="submit-page" />
        <div className="submit conztent warn-on-unload" id="newlink">
          {validationError && (
            <Message type="error" header="Error creating invoice">
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
                  <ErrorField title="Cannot submit invoice" {...props} />
                )}
              />
              <div className="roundfield" id="title-field">
                <div className="roundfield-content">
                  <div style={{ display: "flex", width: "100%" }}>
                    <Field
                      name="month"
                      component={SelectField}
                      options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                      tabIndex={1}
                      label="Month"
                    />
                    <Field
                      name="year"
                      component={SelectField}
                      tabIndex={1}
                      type="text"
                      options={[2019, 2020, 2021, 2022, 2023, 2024, 2025]}
                      label="Year"
                    />
                  </div>
                  <div className="usertext">
                    <div className="usertext-edit md-container" style={{}}>
                      <div className="md">
                        <Field
                          name="csv"
                          component={TextAreaField}
                          type="text"
                          tabIndex={1}
                          placeholder="CSV Invoice Input"
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
                  </div>
                  {submitError ? (
                    <Message
                      type="error"
                      header={`Error ${
                        editingMode ? "updating" : "creating"
                      } invoice`}
                      body={submitError}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProposalSubmit = props => {
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
  } = props;
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
                          component={ToggledMarkdown}
                          tabIndex={2}
                          placeholder="Markdown Entry"
                          rows={20}
                          cols={80}
                        />
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={PROPOSAL_GUIDELINES}
                          style={{ fontSize: "1.01em" }}
                        >
                          Learn how to format your proposal
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
                        <span
                          className="linkish"
                          onClick={() => openModal(MANAGE_CREDITS_MODAL)}
                        >
                          {" "}
                          Click here
                        </span>{" "}
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
};

class SubmitPage extends React.Component {
  render() {
    if (this.props.isCMS) {
      return <InvoiceSubmit {...this.props} />;
    } else {
      return <ProposalSubmit {...this.props} />;
    }
  }
}

export default submitFormHOC(SubmitPage);
