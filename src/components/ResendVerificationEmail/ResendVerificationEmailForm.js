import React from "react";
import { Field, reduxForm } from "redux-form";
import { autobind } from "core-decorators";
import Message from "../Message";
import SignupWarning from "../SignupWarning";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";

const ResendVerificationEmailForm = ({
  error,
  handleSubmit,
  isRequesting,
  onResendVerificationEmail,
  isShowingConfirmation
}) => (
  <form
    className="resend-verification-form"
    onSubmit={handleSubmit(onResendVerificationEmail)}
  >
    {error && (
      <Message type="error" header="Resend verification error" body={error} />
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
    {!isShowingConfirmation ? (
      <div className="c-clearfix c-submit-group">
        <button
          className="c-btn c-btn-primary c-pull-right"
          tabIndex={3}
          type="submit"
        >
          Resend verification email
        </button>
      </div>
    ) : (
      <Message type="info" header="Before you continue...">
        <SignupWarning />
        <ButtonWithLoadingIcon
          style={{ marginRight: "0px" }}
          className="c-btn c-btn-primary c-pull-right"
          tabIndex={3}
          text="I understand, continue"
          isLoading={isRequesting}
        />
      </Message>
    )}
  </form>
);

autobind(ResendVerificationEmailForm);

export default reduxForm({ form: "form/resendVerificationEmail" })(
  ResendVerificationEmailForm
);
