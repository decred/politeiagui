import React from "react";
import { Field, reduxForm } from "redux-form";
import passwordResetConnector from "../../connectors/passwordReset";
import validate from "./PasswordResetValidator";
import ErrorField from "../Form/Fields/ErrorField";
import Message from "../Message";

const PasswordResetForm = ({ handleSubmit, onPasswordReset, isRequesting, apiPasswordResetError }) => {
  if (isRequesting) {
    return <fieldset className="signup-form">Loading...</fieldset>;
  }

  return (
    <form onSubmit={handleSubmit(onPasswordReset)}>
      {apiPasswordResetError ? (
        <Message
          type="error"
          header="Password reset error"
          body={apiPasswordResetError} />
      ) : null}
      <fieldset className="password-reset-form">
        <h2>Reset your password</h2>
        <Field
          name="global"
          component={ErrorField}
        />
        <Field
          name="password"
          placeholder="Password"
          component="input"
          type="password"
        />
        <Field
          name="password_verify"
          placeholder="Verify Password"
          component="input"
          type="password"
        />
        <input type="submit" value="Reset password" />
      </fieldset>
    </form>
  );
};

export default reduxForm({ form: "form/passwordReset", validate })(passwordResetConnector(PasswordResetForm));
