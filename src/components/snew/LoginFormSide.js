import React from "react";
import { Field } from "redux-form";
import ErrorField from "../Form/Fields/ErrorField";
import Message from "../Message";
import ButtonWithLoadingIcon from "./ButtonWithLoadingIcon";
import loginConnector from "../../connectors/login";

const LoginFormSide = ({
  Link,
  isApiRequestingLogin,
  error,
  apiLoginError,
  loggedInAsEmail,
  formAction = "/post/login",
  onLogin,
  handleSubmit
}) =>
  loggedInAsEmail ? null : (
    <div className="spacer">
      <form
        action={formAction}
        className="login-form login-form-side"
        id="login_login-main"
        method="post"
        onSubmit={handleSubmit(({ emailSide, passwordSide }) =>
          onLogin({ email: emailSide, password: passwordSide })
        )}
      >
        <input name="op" type="hidden" defaultValue="login-main" />
        <Field
          id="user_login"
          name="emailSide"
          component="input"
          type="text"
          placeholder="Email Address"
          tabIndex={3}
        />
        <Field
          id="passwd_login"
          tabIndex={3}
          name="passwordSide"
          component="input"
          type="password"
          placeholder="Password"
        />
        <div className="status" />
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
        <div id="remember-me">
          <input
            id="rem-login-main"
            name="remSide"
            tabIndex={1}
            type="checkbox"
          />
          <label htmlFor="rem-login-main">remember me</label>
          <Link
            className="recover-password"
            href="/privacy-policy"
            style={{ marginRight: "10px" }}
          >
            Privacy Policy
          </Link>
          <Link className="recover-password" href="/password">
            Reset Password
          </Link>
        </div>
        <div className="submit">
          <ButtonWithLoadingIcon
            tabIndex={1}
            isLoading={isApiRequestingLogin}
            text="Login"
          />
        </div>
        <div className="clear" />
      </form>
    </div>
  );

export default loginConnector(LoginFormSide);
