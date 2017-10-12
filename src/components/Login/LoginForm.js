import React from "react";
import { reduxForm, Field } from "redux-form";
import ErrorMsg from "../ErrorMsg";
import loginFormConnector from "../../connectors/loginForm";

const LoginForm = ({
  isApiRequestingLogin,
  apiLoginError,
  onShowSignup,
  onLogin,
  handleSubmit
}) => isApiRequestingLogin ? (
  <fieldset className="login-form">Logging In...</fieldset>
) : (
  <form onSubmit={handleSubmit(onLogin)}>
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
      <button onClick={onShowSignup}>Signup</button>
      {apiLoginError ? (
        <div>
          Login Error: <ErrorMsg error={apiLoginError} />
        </div>
      ) : null}
    </fieldset>
  </form>
);

export default reduxForm({ form: "form/login" })(loginFormConnector(LoginForm));
