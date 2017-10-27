import React from "react";
import signupConnector from "../../connectors/signup";
import { Field } from "redux-form";
import Message from "../Message";
import ErrorField from "../Form/Fields/ErrorField";

const RegisterForm = ({
  Loading,
  error,
  isApiRequestingNewUser,
  apiNewUserError,
  apiVerifyNewUserError,
  loggedInAs,
  usernameError,
  passwdError,
  passwd2Error,
  onSignup,
  handleSubmit
}) => isApiRequestingNewUser ? <Loading /> : loggedInAs ? null : (
  <form
    action="/post/reg"
    className="form-v2"
    id="register-form"
    method="post"
    name="register-form"
    onSubmit={handleSubmit(onSignup)}
  >
    <input name="op" type="hidden" defaultValue="reg" />
    <input
      name="dest"
      type="hidden"
      defaultValue="/"
    />
    <div className="c-form-group">
      <label className="screenreader-only" htmlFor="user_reg">
        username:
      </label>
      <Field
        name="email"
        placeholder="Email Address"
        component="input"
        type="text"
        className="c-form-control"
        data-validate-min={3}
        data-validate-url="/api/check_username.json"
        id="user_reg"
        tabIndex={2}
      />
      <div className="c-form-control-feedback-wrapper">
        {usernameError
          ? <span className="c-form-control-feedback c-form-control-feedback-error" title={usernameError} />
          : null}
      </div>
    </div>
    <div className="c-form-group">
      <label className="screenreader-only" htmlFor="passwd_reg">
        password:
      </label>
      <Field
        name="password"
        placeholder="password"
        component="input"
        type="password"
        className="c-form-control"
        id="passwd_reg"
        tabIndex={2}
      />
      <div className="c-form-control-feedback-wrapper">
        {passwdError
          ? <span className="c-form-control-feedback c-form-control-feedback-error" title={passwdError} />
          : null}
      </div>
    </div>
    <div className="c-form-group">
      <label className="screenreader-only" htmlFor="passwd2_reg">
        verify password:
      </label>
      <Field
        name="password_verify"
        component="input"
        type="password"
        className="c-form-control"
        id="passwd2_reg"
        placeholder="verify password"
        tabIndex={2}
      />
      <div className="c-form-control-feedback-wrapper">
        {passwd2Error
          ? <span className="c-form-control-feedback c-form-control-feedback-error" title={passwd2Error} />
          : null}
      </div>
      <Field
        name="global"
        component={props => <ErrorField title="Cannot sign up" {...props} />}
      />
      {error || apiNewUserError || apiVerifyNewUserError ? (
        <Message
          type="error"
          header="Signup failed"
          body={error || apiNewUserError || apiVerifyNewUserError} />
      ) : null}
    </div>
    <div className="c-clearfix c-submit-group">
      <button
        className="c-btn c-btn-primary c-pull-right"
        tabIndex={2}
      >sign up</button>
    </div>
    <div>
      <div className="c-alert c-alert-danger" />
    </div>
  </form>
);

export default signupConnector(RegisterForm);
