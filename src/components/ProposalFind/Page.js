import React from "react";
import { reduxForm, Field } from "redux-form";
import LoadingPage from "../LoadingPage";
import Message from "../Message";

const FindPage = ({
  isSaving,
  onFind,
  handleSubmit,
}) => isSaving ? <LoadingPage /> : (
  <div>
    <form onSubmit={handleSubmit(onFind)}>
      {error && <Message
        type="error"
        header="Cannot search for proposal"
        body={error}
      />}
      <h2>
        <Field
          name="censorship"
          component="input"
          type="text"
          placeholder="Censorship token"
          size={80}
        />
      </h2>
      <input type="submit" value="Search" />
    </form>
  </div>
);

export default reduxForm({ form: "form/proposal-find" })(FindPage);
