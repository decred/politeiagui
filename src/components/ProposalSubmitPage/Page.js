import React from "react";
import { reduxForm, Field } from "redux-form";
import LoadingPage from "../LoadingPage";
import MarkdownEditorField from "../Form/Fields/MarkdownEditorField";
import FilesField from "../Form/Fields/FilesField";
import ErrorField from "../Form/Fields/ErrorField";
import validate from "./validator";
import proposalNewConnector from "../../connectors/proposalNew";
import ErrorMsg from "../ErrorMsg";

const SubmitPage = ({
  //policy,
  isSaving,
  error,
  onSave,
  handleSubmit,
  newProposalError,
}) => isSaving ? <LoadingPage /> : (
  <div>
    {newProposalError ? (
      <div className="error">
        Proposal Error: <ErrorMsg error={newProposalError} />
      </div>
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
      />
      <input type="submit" value="Save" />
    </form>
  </div>
);

export default reduxForm({ form: "form/proposal", validate })(proposalNewConnector(SubmitPage));
