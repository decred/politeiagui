import React from "react";
import { Field } from "redux-form";
import Message from "../Message";
import ButtonWithLoadingIcon from "./ButtonWithLoadingIcon";
import ErrorField from "../Form/Fields/ErrorField";
import loginConnector from "../../connectors/login";

const LoginForm = ({
  Link,
  formAction = "/post/login",
  error,
  isApiRequestingLogin,
  loggedInAsEmail,
  apiLoginError,
  onLogin,
  handleSubmit
}) =>
  loggedInAsEmail ? null : (
    <form
      action={formAction}
      className="form-v2"
      id="login-form"
      method="post"
      name="login-form"
      onSubmit={onLogin ? handleSubmit(onLogin) : null}
    >
      <input name="op" type="hidden" defaultValue="login" />
      <input name="dest" type="hidden" defaultValue="/" />
      <div className="c-form-group">
        <label className="screenreader-only" htmlFor="user_login">
          username:
        </label>
        <Field
          autoFocus
          className="c-form-control"
          id="user_login"
          name="email"
          component="input"
          type="text"
          placeholder="Email Address"
          tabIndex={4}
        />
      </div>
      <div className="c-form-group">
        <label className="screenreader-only" htmlFor="passwd_login">
          password:
        </label>
        <Field
          className="c-form-control"
          id="passwd_login"
          tabIndex={4}
          name="password"
          component="input"
          type="password"
          placeholder="Password"
        />
        {error || apiLoginError ? (
          <Message
            type="error"
            header="Login error"
            body={error || apiLoginError}
          />
        ) : null}
        <Field
          name="global"
          component={props => <ErrorField title="Cannot login" {...props} />}
        />
      </div>
      <div className="c-checkbox">
        <input id="rem_login" name="rem" tabIndex={4} type="checkbox" />
        <label htmlFor="rem_login">remember me</label>
      </div>
      <div className="c-clearfix c-submit-group">
        <ButtonWithLoadingIcon
          style={{ marginRight: "0px" }}
          className="c-btn c-btn-primary c-pull-right"
          tabIndex={7}
          text="LOGIN"
          isLoading={isApiRequestingLogin}
        />
        <Link
          className="c-pull-right reset-password-link"
          href="/password"
          tabIndex={4}
        >
          Reset Password
        </Link>
        <Link
          className="c-pull-right reset-password-link"
          href="/privacy-policy"
          tabIndex={4}
        >
          Privacy Policy
        </Link>
      </div>
    </form>
  );

export default loginConnector(LoginForm);
