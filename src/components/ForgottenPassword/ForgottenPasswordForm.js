import React from "react";
import { Field, reduxForm } from "redux-form";
import { autobind } from "core-decorators";
import Message from "../Message";

const ForgottenPasswordForm = ({ error, handleSubmit, isRequesting, onForgottenPassword }) => {
  if (isRequesting) {
    return <fieldset className="signup-form">Loading...</fieldset>;
  }

  return (
    <form onSubmit={handleSubmit(onForgottenPassword)}>
      {error && <Message
        type="error"
        header="Forgotten password error"
        body={error}
      />}
      <fieldset className="forgottenPassword-form">
        <h2>Reset your password</h2>
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

autobind(ForgottenPasswordForm);

export default reduxForm({ form: "form/forgottenPassword" })(ForgottenPasswordForm);
