import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import { SubmissionError } from "redux-form";
import ForgottenPasswordForm from "./ForgottenPasswordForm";
import forgottenPasswordConnector from "../../connectors/forgottenPassword";
import validate from "./ForgottenPasswordValidator";

class ForgottenPassword extends Component {
  componentWillUnmount() {
    this.props.resetForgottenPassword();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forgottenPasswordResponse) {
      nextProps.history.push("/user/forgotten/password/next");
    }
  }

  render() {
    return (
      <ForgottenPasswordForm {...{
        onForgottenPassword: this.onForgottenPassword,
        isRequesting: this.props.isRequesting
      }} />
    );
  }

  onForgottenPassword(props) {
    validate(props);
    return this
      .props
      .onForgottenPasswordRequest(props)
      .catch((error) => {
        throw new SubmissionError({
          _error: error.message,
        });
      });
  }
}

autobind(ForgottenPassword);

export default forgottenPasswordConnector(withRouter(ForgottenPassword));
