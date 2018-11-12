import React from "react";
import { Field, reduxForm } from "redux-form";
import ErrorField from "../Form/Fields/ErrorField";
import Message from "../Message";
import { PageLoadingIcon } from "../snew";

const PasswordResetForm = ({
  error,
  handleSubmit,
  onPasswordReset,
  isRequesting
}) => {
  if (isRequesting) {
    return <PageLoadingIcon />;
  }

  return (
    <form
      className="reset-password-form"
      onSubmit={handleSubmit(onPasswordReset)}
    >
      {error && (
        <Message type="error" header="Password reset error" body={error} />
      )}
      <Field name="global" component={ErrorField} />
      <div className="c-form-group">
        <label className="screenreader-only" htmlFor="password">
          Password:
        </label>
        <Field
          autoFocus
          className="c-form-control"
          id="newPassword"
          name="newPassword"
          component="input"
          type="password"
          placeholder="Password"
          tabIndex={3}
        />
      </div>
      <div className="c-form-group">
        <label className="screenreader-only" htmlFor="newPasswordVerify">
          Verify Password:
        </label>
        <Field
          className="c-form-control"
          id="newPasswordVerify"
          name="newPasswordVerify"
          component="input"
          type="password"
          placeholder="Verify Password"
          tabIndex={3}
        />
      </div>
      <div className="c-clearfix c-submit-group">
        <button
          className="c-btn c-btn-primary c-pull-right"
          tabIndex={3}
          type="submit"
        >
          Reset Password
        </button>
      </div>
    </form>
  );
};

export default reduxForm({ form: "form/passwordReset" })(PasswordResetForm);
