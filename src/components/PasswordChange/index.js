import React, { Component } from "react";
import { autobind } from "core-decorators";
import ChangePasswordForm from "./Form";
import changePasswordConnector from "../../connectors/changePassword";
import Message from "../Message";

class ChangePassword extends Component {
  render() {
    return (
      <div className="login-form">
        {this.props.changePasswordResponse && this.props.changePasswordResponse.errorcode && <Message
          type="success"
          header="Change Password success"
          body="The password was successfully updated" />}
        <ChangePasswordForm {...{
          onChangePassword: this.onChangePassword,
        }} />
      </div>
    );
  }

  onChangePassword(props) {
    this.props.onChangePassword(props);
  }
}

autobind(ChangePassword);

export default changePasswordConnector(ChangePassword);
