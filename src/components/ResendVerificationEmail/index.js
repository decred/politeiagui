import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router-dom";
import { SubmissionError } from "redux-form";
import ResendVerificationEmailForm from "./ResendVerificationEmailForm";
import resendVerificationEmailConnector from "../../connectors/resendVerificationEmail";
import validate from "./ResendVerificationEmailValidator";

class ResendVerificationEmail extends Component {
  componentDidUpdate() {
    if (this.props.resendVerificationEmailResponse) {
      this.props.history.push("/user/resend/next");
    }
  }

  render() {
    return (
      <ResendVerificationEmailForm
        {...{
          onResendVerificationEmail: this.onResendVerificationEmail,
          isShowingConfirmation: this.props.isShowingConfirmation,
          isRequesting: this.props.isRequesting
        }}
      />
    );
  }

  onResendVerificationEmail(props) {
    validate(props);

    if (!this.props.isShowingConfirmation) {
      return this.props.onResendVerificationEmail();
    }

    const promise = this.props.onResendVerificationEmailConfirm(props);
    if (promise) {
      return promise.catch(e => {
        throw new SubmissionError({
          _error: e.message
        });
      });
    }
  }
}

autobind(ResendVerificationEmail);

export default resendVerificationEmailConnector(
  withRouter(ResendVerificationEmail)
);
