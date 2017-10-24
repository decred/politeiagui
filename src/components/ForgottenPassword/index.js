import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import ForgottenPasswordForm from "./ForgottenPasswordForm";
import forgottenPasswordConnector from "../../connectors/forgottenPassword";

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
      <div className="forgotten-password-form">
        <ForgottenPasswordForm {...{
          onForgottenPassword: this.onForgottenPassword,
          isRequesting: this.props.isRequesting
        }} />
      </div>
    );
  }

  onForgottenPassword(props) {
    this.props.onForgottenPasswordRequest(props);
  }
}

autobind(ForgottenPassword);

export default forgottenPasswordConnector(withRouter(ForgottenPassword));
