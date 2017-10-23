import React from "react";
import { reduxForm, Field } from "redux-form";
import LoadingPage from "../LoadingPage";
import ErrorField from "../Form/Fields/ErrorField";
import validate from "./validator";

const FindPage = ({
  isSaving,
  error,
  onFind,
  handleSubmit,
}) => isSaving ? <LoadingPage /> : (
  <div>
    <form onSubmit={handleSubmit(onFind)}>
      <Field
        name="global"
        component={props => <ErrorField title="Cannot search for proposal" {...props} />}
      />
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

export default reduxForm({ form: "form/proposal-find", validate })(FindPage);
