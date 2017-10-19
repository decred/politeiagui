import React from "react";
import PropTypes from "prop-types";
import { reduxForm, Field } from "redux-form";
import LoadingPage from "../LoadingPage";
import MarkdownEditorField from "../Form/Fields/MarkdownEditorField";
import FilesField from "../Form/Fields/FilesField";
import ErrorField from "../Form/Fields/ErrorField";
import validate from "./validator";
import proposalNewConnector from "../../connectors/proposalNew";
import Message from "../Message";

const SubmitPage = ({
  policy,
  isSaving,
  error,
  onSave,
  handleSubmit,
  newProposalError,
}) => isSaving || !policy ? <LoadingPage /> : (
  <div>
    {newProposalError ? (
      <Message
        type="error"
        header="Error creating proposal"
        error={newProposalError} />
    ) : null}
    <form onSubmit={handleSubmit(onSave)}>
      {error ? <div className="error">{error}</div> : null}
      <Field
        name="global"
        component={ErrorField}
      />
      <h2>
        <Field
          name="name"
          component="input"
          type="text"
          placeholder="Proposal Name"
        />
      </h2>

      {error ? (
        <div className={"error"}>
          {(typeof error === "string") ? error : (
            <pre>{JSON.stringify(error, null, 2)}</pre>
          )}
        </div>
      ) : null}

      <Field
        name="description"
        component={MarkdownEditorField}
        placeholder="Markdown Entry"
        rows={20}
        cols={80}
      />
      <Field
        name="files"
        component={FilesField}
        placeholder="Select Files"
        policy={policy}
      />
      <input type="submit" value="Save" />
    </form>
  </div>
);

SubmitPage.propTypes = {
  policy: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  newProposalError: PropTypes.string,
};

export default reduxForm({ form: "form/proposal", validate })(proposalNewConnector(SubmitPage));
