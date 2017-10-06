import React from "react";
import ErrorMsg from "../ErrorMsg";
import loginFormConnector from "../../connectors/loginForm";

const LoginForm = ({
  email,
  password,
  isApiRequestingLogin,
  apiLoginError,
  onSetEmail,
  onSetPassword,
  onShowSignup,
  onLogin
}) => isApiRequestingLogin ? (
  <fieldset className="login-form">Logging In {email}...</fieldset>
) : (
  <fieldset className="login-form">
    <h2>Login</h2>
    <input
      type="text"
      placeholder="Email Address"
      value={email}
      onChange={evt => onSetEmail(evt.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onInput={evt => onSetPassword(evt.target.value)}
    />
    <button disabled={!email || !password} onClick={onLogin}>Login</button>
    <button onClick={onShowSignup}>Signup</button>
    {apiLoginError ? (
      <div>
        Login Error: <ErrorMsg error={apiLoginError} />
      </div>
    ) : null}
  </fieldset>
);

export default loginFormConnector(LoginForm);
