import React, { Component } from "react";
import { autobind } from "core-decorators";
import { SubmissionError } from "redux-form";
import ChangePasswordForm from "./Form";
import changePasswordConnector from "../../connectors/changePassword";
import Message from "../Message";
import validate from "../../validators/password-change";

class ChangePassword extends Component {
  componentDidMount() {
    this.props.policy || this.props.onFetchData();
  }

  onChangePassword(props) {
    const policy = this.props.policy;

    validate(props, policy);

    return this.props.onChangePassword(props).catch(error => {
      throw new SubmissionError({
        _error: error.message
      });
    });
  }

  render() {
    return (
      <div>
        {this.props.changePasswordResponse && (
          <Message
            type="success"
            header="Password changed"
            body="Your password was successfully changed."
          />
        )}
        <ChangePasswordForm
          {...{
            ...this.props,
            onChangePassword: this.onChangePassword
          }}
        />
      </div>
    );
  }
}

autobind(ChangePassword);

export default changePasswordConnector(ChangePassword);
