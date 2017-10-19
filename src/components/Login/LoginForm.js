import React from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import Message from "../Message";
import loginFormConnector from "../../connectors/loginForm";
import ErrorField from "../Form/Fields/ErrorField";
import validate from "./LoginValidator";

const LoginForm = ({
  isApiRequestingLogin,
  apiLoginError,
  onLogin,
  handleSubmit
}) => isApiRequestingLogin ? (
  <fieldset className="login-form">Logging In...</fieldset>
) : (
  <form onSubmit={handleSubmit(onLogin)}>
    <fieldset className="login-form">
      {apiLoginError ? (
        <Message
          type="error"
          header="Login error"
          error={apiLoginError} />
      ) : null}
      <Field
        name="global"
        component={ErrorField}
      />
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
    </fieldset>
  </form>
);

export default reduxForm({ form: "form/login", validate })(loginFormConnector(LoginForm));
