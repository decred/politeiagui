import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import ChangePasswordForm from "./Form";
import loginConnector from "../../connectors/login";

class ChangePassword extends Component {
  componentWillUnmount() {
    this.props.onResetNewUser();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newUserResponse) {
      nextProps.history.push("/user/signup/next");
    }
  }

  render() {
    return (
      <div className="login-form">
        <ChangePasswordForm {...{
          onChangePassword: this.onChangePassword,
          hideCancel: this.props.signup
        }} />
      </div>
    );
  }

  onChangePassword(props) {
    this.props.onChangePassword(props);
  }
}

autobind(ChangePassword);

export default loginConnector(withRouter(ChangePassword));
