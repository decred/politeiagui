import React from "react";
import { reduxForm, Field } from "redux-form";
import Message from "../Message";

const SignupForm = ({
  error,
  isRequesting,
  hideCancel,
  onSignup,
  onCancelSignup,
  handleSubmit
}) => isRequesting ? (
  <fieldset className="signup-form">Signing up...</fieldset>
) : (
  <form onSubmit={handleSubmit(onSignup)}>
    {error && <Message
      type="error"
      header="Cannot sign up"
      body={error}
    />}
    <fieldset className="signup-form">
      <h2>Sign up</h2>
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
    </fieldset>
  </form>
);

SignupForm.defaultProps = {
  hideCancel: true,
};

export default reduxForm({ form: "form/signup" })(SignupForm);
