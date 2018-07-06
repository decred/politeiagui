import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import { SubmissionError } from "redux-form";
import ResendVerificationEmailForm from "./ResendVerificationEmailForm";
import resendVerificationEmailConnector from "../../connectors/resendVerificationEmail";
import validate from "./ResendVerificationEmailValidator";

class ResendVerificationEmail extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.resendVerificationEmailResponse) {
      nextProps.history.push("/user/resend/next");
    }
  }

  render() {
    return (
      <ResendVerificationEmailForm {...{
        onResendVerificationEmail: this.onResendVerificationEmail,
        isRequesting: this.props.isRequesting
      }} />
    );
  }

  onResendVerificationEmail(props) {
    validate(props);
    return this
      .props
      .onResendVerificationEmailRequest(props)
      .catch((error) => {
        throw new SubmissionError({
          _error: error.message,
        });
      });
  }
}

autobind(ResendVerificationEmail);

export default resendVerificationEmailConnector(withRouter(ResendVerificationEmail));
