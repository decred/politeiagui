import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import LoadingPage from "../LoadingPage";
import MarkdownEditorField from "../Form/Fields/MarkdownEditorField";
import FilesField from "../Form/Fields/FilesField";
import normalizer from "./normalizer";
import Message from "../Message";

const Form = ({
  policy,
  isRequesting,
  error,
  onSave,
  handleSubmit,
}) => isRequesting || !policy ? <LoadingPage /> : (
  <form onSubmit={handleSubmit(onSave)}>
    {error && <Message
      type="error"
      header="Cannot submit proposal"
      body={error}
    />}
    <h2>
      <Field
        name="name"
        component="input"
        type="text"
        placeholder="Proposal Name"
      />
    </h2>
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
      placeholder="Attach files"
      policy={policy}
      normalize={normalizer}
    />
    <div className="proposal-save"><input type="submit" value="Save" /></div>
  </form>
);

Form.propTypes = {
  policy: PropTypes.object,
  isRequesting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  newProposalError: PropTypes.string,
};

export default reduxForm({ form: "form/proposal" })(Form);
