import React from "react";
import { Field, reduxForm } from "redux-form";
import forgottenPasswordConnector from "../../connectors/forgottenPassword";
import validate from "./ForgottenPasswordValidator";
import ErrorField from "../Form/Fields/ErrorField";
import Message from "../Message";


const ForgottenPasswordForm = ({ handleSubmit, onForgottenPassword, isRequesting, apiForgottenPasswordError }) => {
  if (isRequesting) {
    return <fieldset className="signup-form">resetting up...</fieldset>;
  }

  return (
    <form onSubmit={handleSubmit(onForgottenPassword)}>
      {apiForgottenPasswordError ? (
        <Message
          type="error"
          header="Forgotten password error"
          body={apiForgottenPasswordError} />
      ) : null}
      <fieldset className="forgottenPassword-form">
        <h2>Forgotten password</h2>
        <Field
          name="global"
          component={ErrorField}
        />
        <Field
          name="email"
          placeholder="Email Address"
          component="input"
          type="text"
        />
        <input type="submit" value="Reset password" />
      </fieldset>
    </form>
  );
};

export default reduxForm({ form: "form/forgottenPassword", validate })(forgottenPasswordConnector(ForgottenPasswordForm));
