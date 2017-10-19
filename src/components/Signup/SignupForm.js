import React from "react";
import { reduxForm, Field } from "redux-form";
import Message from "../Message";
import signupFormConnector from "../../connectors/signupForm";
import validate from "./SignupValidator";
import ErrorField from "../Form/Fields/ErrorField";

const SignupForm = ({
  isApiRequestingNewUser,
  isApiRequestingVerifyNewUser,
  apiNewUserError,
  apiVerifyNewUserError,
  hideCancel,
  onSignup,
  onCancelSignup,
  handleSubmit
}) => isApiRequestingVerifyNewUser ? (
  <fieldset className="signup-form">Verifying...</fieldset>
) : isApiRequestingNewUser ? (
  <fieldset className="signup-form">Signing up...</fieldset>
) : (
  <form onSubmit={handleSubmit(onSignup)}>
    <fieldset className="signup-form">
      <h2>Sign up</h2>
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
      {hideCancel ? null : <button onClick={onCancelSignup}>Cancel</button>}
      <input type="submit" value="Signup" />
      {apiNewUserError || apiVerifyNewUserError ? (
        <Message
          type="error"
          header="Signup error"
          error={apiNewUserError || apiVerifyNewUserError} />
      ) : null}
    </fieldset>
  </form>
);

export default reduxForm({ form: "form/signup", validate })(signupFormConnector(SignupForm));
