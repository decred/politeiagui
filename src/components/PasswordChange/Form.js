import React from "react";
import { reduxForm, Field } from "redux-form";
import Message from "../Message";
import { PageLoadingIcon } from "../snew";

const ChangePasswordForm = ({
  error,
  isApiRequestingChangePassword,
  onChangePassword,
  handleSubmit
}) => isApiRequestingChangePassword ? (
  <PageLoadingIcon />
) : (
  <form className="change-password-form" onSubmit={handleSubmit(onChangePassword)}>
    {error && <Message
      type="error"
      header="Cannot change password"
      body={error}
    />}
    <div className="c-form-group">
      <label className="screenreader-only" htmlFor="existingPassword">
        Current Password:
      </label>
      <Field
        className="c-form-control"
        id="existingPassword"
        name="existingPassword"
        component="input"
        type="password"
        placeholder="Current Password"
        tabIndex={3} />
    </div>
    <div className="c-form-group">
      <label className="screenreader-only" htmlFor="password">
        New Password:
      </label>
      <Field
        className="c-form-control"
        id="password"
        name="password"
        component="input"
        type="password"
        placeholder="New Password"
        tabIndex={3} />
    </div>
    <div className="c-form-group">
      <label className="screenreader-only" htmlFor="password_verify">
        Verify Password:
      </label>
      <Field
        className="c-form-control"
        id="password_verify"
        name="password_verify"
        component="input"
        type="password"
        placeholder="Verify Password"
        tabIndex={3} />
    </div>
    <div className="c-clearfix c-submit-group">
      <button
        className="c-btn c-btn-primary c-pull-right"
        tabIndex={3}
        type="submit"
      >
        Change Password
      </button>
    </div>
  </form>
);

export default reduxForm({ form: "form/change-password" })(ChangePasswordForm);
