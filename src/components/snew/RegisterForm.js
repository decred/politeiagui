import React from "react";
import signupFormHOC from "../../hocs/signupForm";
import { Field } from "redux-form";
import Message from "../Message";
import SignupWarning from "../SignupWarning";
import ButtonWithLoadingIcon from "./ButtonWithLoadingIcon";
import ErrorField from "../Form/Fields/ErrorField";
import { getUsernameFieldLabel, getPasswordFieldLabel } from "../../helpers";

const RegisterForm = ({
  Link,
  error,
  isApiRequestingNewUser,
  apiNewUserError,
  apiVerifyNewUserError,
  policy,
  loggedInAsEmail,
  passwdError,
  passwd2Error,
  isShowingSignupConfirmation,
  onSignup,
  handleSubmit,
  isCMS
}) =>
  loggedInAsEmail ? null : (
    <form
      action="/post/reg"
      className="form-v2"
      id="register-form"
      method="post"
      name="register-form"
      onSubmit={handleSubmit(onSignup)}
    >
      <input name="op" type="hidden" defaultValue="reg" />
      <input name="dest" type="hidden" defaultValue="/" />
      <div className="c-form-group">
        <label className="screenreader-only" htmlFor="user_reg">
          email address:
        </label>
        <Field
          name="email"
          placeholder="Email Address"
          component="input"
          type="text"
          className="c-form-control"
          id="user_reg"
          tabIndex={2}
        />
      </div>
      {isCMS && (
        <div className="c-form-group">
          <label className="screenreader-only" htmlFor="user_reg">
            token:
          </label>
          <Field
            name="verificationtoken"
            placeholder="Invitation Token"
            component="input"
            type="text"
            className="c-form-control"
            id="user_reg"
            tabIndex={2}
          />
        </div>
      )}
      <div className="c-form-group">
        <label className="screenreader-only" htmlFor="user_reg">
          username:
        </label>
        <Field
          name="username"
          placeholder={getUsernameFieldLabel(policy)}
          component="input"
          type="text"
          className="c-form-control"
          id="username_reg"
          tabIndex={2}
        />
      </div>
      <div className="c-form-group">
        <label className="screenreader-only" htmlFor="passwd_reg">
          password:
        </label>
        <Field
          name="password"
          placeholder={getPasswordFieldLabel(policy)}
          component="input"
          type="password"
          className="c-form-control"
          id="passwd_reg"
          tabIndex={2}
        />
        <div className="c-form-control-feedback-wrapper">
          {passwdError ? (
            <span
              className="c-form-control-feedback c-form-control-feedback-error"
              title={passwdError}
            />
          ) : null}
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
          placeholder="Verify Password"
          tabIndex={2}
        />
        <div className="c-form-control-feedback-wrapper">
          {passwd2Error ? (
            <span
              className="c-form-control-feedback c-form-control-feedback-error"
              title={passwd2Error}
            />
          ) : null}
        </div>
      </div>
      <div className="c-form-group">
        <Field
          name="global"
          component={props => <ErrorField title="Cannot sign up" {...props} />}
        />
        {error || apiNewUserError || apiVerifyNewUserError ? (
          <Message
            type="error"
            header="Signup error"
            body={error || apiNewUserError || apiVerifyNewUserError}
          />
        ) : null}
      </div>
      {!isShowingSignupConfirmation ? (
        <div className="c-clearfix c-submit-group">
          <ButtonWithLoadingIcon
            style={{ marginRight: "0px" }}
            className="c-btn c-btn-primary c-pull-right"
            tabIndex={3}
            text="Sign up"
            isLoading={false}
          />
          {!isCMS && (
            <Link
              className="c-pull-right resend-verification-link"
              href="/user/resend"
              tabIndex={2}
            >
              Resend verification email
            </Link>
          )}
        </div>
      ) : (
        <Message type="info" header="Before you sign up...">
          <SignupWarning />
          <ButtonWithLoadingIcon
            style={{ marginRight: "0px", overflow: "hidden" }}
            className="c-btn c-btn-primary c-pull-right"
            tabIndex={3}
            text="I understand, sign me up"
            isLoading={isApiRequestingNewUser}
          />
        </Message>
      )}
      <div>
        <div className="c-alert c-alert-danger" />
      </div>
    </form>
  );

export default signupFormHOC(RegisterForm);
