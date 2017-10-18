import React from "react";
import { reduxForm, Field } from "redux-form";
import ErrorMsg from "../ErrorMsg";
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
      <h2>Signup</h2>
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
      {apiNewUserError ? (
        <div className="error">
          Signup Error: <ErrorMsg error={apiNewUserError} />
        </div>
      ) : null}
      {apiVerifyNewUserError ? (
        <div className="error">
          Signup Verify Error: <ErrorMsg error={apiVerifyNewUserError} />
        </div>
      ) : null}
    </fieldset>
  </form>
);

export default reduxForm({ form: "form/signup", validate })(signupFormConnector(SignupForm));
