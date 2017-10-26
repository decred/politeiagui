import React from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import Message from "../Message";

const LoginForm = ({
  error,
  isRequesting,
  onLogin,
  handleSubmit
}) => isRequesting ? (
  <fieldset className="login-form">Logging In...</fieldset>
) : (
  <form onSubmit={handleSubmit(onLogin)}>
    {error && <Message
      type="error"
      header="Login error"
      body={error}
    />}
    <fieldset className="login-form">
      <Field
        name="email"
        component="input"
        type="text"
        placeholder="Email Address"
      />
      <Field
        name="password"
        component="input"
        type="password"
        placeholder="Password"
      />
      <input type="submit" value="Login" />
      <Link className="signup-link" to="/user/signup">Sign up</Link>
      <Link className="forgotten-password-link" to="/user/forgotten/password">Forgot your password?</Link>
    </fieldset>
  </form>
);

export default reduxForm({ form: "form/login" })(LoginForm);
