import React from "react";
import { Field } from "redux-form";
import ErrorField from "../Form/Fields/ErrorField";
import Message from "../Message";
import loginConnector from "../../connectors/login";

const LoginFormSide = ({
  Link,
  Loading,
  isApiRequestingLogin,
  apiLoginError,
  loggedInAs,
  formAction="/post/login",
  onLogin,
  handleSubmit,
}) => isApiRequestingLogin ? <Loading /> : loggedInAs ? null : (
  <div className="spacer">
    <form
      action={formAction}
      className="login-form login-form-side"
      id="login_login-main"
      method="post"
      onSubmit={handleSubmit(onLogin)}
    >
      <input name="op" type="hidden" defaultValue="login-main" />
      <Field
        id="user_login"
        name="email"
        component="input"
        type="text"
        placeholder="Email Address"
        tabIndex={3}
      />
      <Field
        id="passwd_login"
        tabIndex={3}
        name="password"
        component="input"
        type="password"
        placeholder="Password"
      />
      <div className="status" />
      <div className="status">
        {apiLoginError ? (
          <Message
            type="error"
            header="Login error"
            body={apiLoginError} />
        ) : null}
        <Field
          name="global"
          component={props => <ErrorField title="Cannot login" {...props} />}
        />
      </div>
      <div id="remember-me">
        <input id="rem-login-main" name="rem" tabIndex={1} type="checkbox" />
        <label htmlFor="rem-login-main">remember me</label>
        <Link className="recover-password" href="/password">
          reset password
        </Link>
      </div>
      <div className="submit">
        <button className="btn" tabIndex={1} type="submit">
          login
        </button>
      </div>
      <div className="clear" />
    </form>
  </div>
);

export default loginConnector(LoginFormSide);
