import React from "react";
import { reduxForm, Field } from "redux-form";
import LoadingPage from "../LoadingPage";
import ErrorField from "../Form/Fields/ErrorField";

const FindPage = ({
  isSaving,
  error,
  onFind,
  handleSubmit,
}) => isSaving ? <LoadingPage /> : (
  <div>
    <form onSubmit={handleSubmit(onFind)}>
      {error ? <div className="error">{error}</div> : null}
      <Field
        name="global"
        component={ErrorField}
      />
      <h2>
        <Field
          name="censorship"
          component="input"
          type="text"
          placeholder="Censorship token"
        />
      </h2>
      <input type="submit" value="OK" />
    </form>
  </div>
);

export default reduxForm({ form: "form/proposal-find" })(FindPage);
