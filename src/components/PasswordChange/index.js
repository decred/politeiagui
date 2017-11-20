import React, { Component } from "react";
import { autobind } from "core-decorators";
import { SubmissionError } from "redux-form";
import ChangePasswordForm from "./Form";
import changePasswordConnector from "../../connectors/changePassword";
import Message from "../Message";
import validate from "./Validator";

class ChangePassword extends Component {
  onChangePassword(props) {
    validate(props);

    return this
      .props
      .onChangePassword(props)
      .catch((error) => {
        throw new SubmissionError({
          _error: error.message,
        });
      });
  }
  render() {
    return (
      <div className="change-password-form">
        {this.props.changePasswordResponse && <Message
          type="success"
          header="Change Password success"
          body="The password was successfully updated" />}
        <ChangePasswordForm
          {...{
            ...this.props,
            onChangePassword: this.onChangePassword,
          }}
        />
      </div>
    );
  }
}

autobind(ChangePassword);

export default changePasswordConnector(ChangePassword);
