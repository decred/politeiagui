import React from "react";
import { Field, reduxForm } from "redux-form";
import { autobind } from "core-decorators";
import Message from "../Message";
import { PageLoadingIcon } from "../snew";

const ForgottenPasswordForm = ({
  error,
  handleSubmit,
  isRequesting,
  onForgottenPassword
}) => {
  if (isRequesting) {
    return <PageLoadingIcon />;
  }

  return (
    <form
      className="forgotten-password-form"
      onSubmit={handleSubmit(onForgottenPassword)}
    >
      {error && (
        <Message type="error" header="Forgotten password error" body={error} />
      )}
      <div className="c-form-group">
        <label className="screenreader-only" htmlFor="email">
          Email Address:
        </label>
        <Field
          autoFocus
          className="c-form-control"
          id="email"
          name="email"
          component="input"
          type="text"
          placeholder="Email Address"
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

autobind(ForgottenPasswordForm);

export default reduxForm({ form: "form/forgottenPassword" })(
  ForgottenPasswordForm
);
