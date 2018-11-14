import React, { Component } from "react";
import { autobind } from "core-decorators";
import { SubmissionError } from "redux-form";
import ChangeUsernameForm from "./Form";
import changeUsernameConnector from "../../connectors/changeUsername";
import Message from "../Message";
import validate from "../../validators/username-change";

class ChangeUsername extends Component {
  componentDidMount() {
    this.props.policy || this.props.onFetchData();
  }

  onChangeUsername(props) {
    const policy = this.props.policy;
    props = {
      ...props,
      newUsername: props.newUsername && props.newUsername.trim()
    };
    validate(props, policy);

    return this.props.onChangeUsername(props).catch(error => {
      throw new SubmissionError({
        _error: error.message
      });
    });
  }

  render() {
    return (
      <div>
        {this.props.changeUsernameResponse && (
          <Message
            type="success"
            header="Username changed"
            body="Your username was successfully changed."
          />
        )}
        <ChangeUsernameForm
          {...{
            ...this.props,
            onChangeUsername: this.onChangeUsername
          }}
        />
      </div>
    );
  }
}

autobind(ChangeUsername);

export default changeUsernameConnector(ChangeUsername);
