import React, { Component } from "react";
import { autobind } from "core-decorators";
import ErrorMessage from "./ErrorMessage";
import changePasswordConnector from "../../connectors/changePassword";

class ErrorPage extends Component {

  render() {
    const { error } = this.props;
    return (
      <ErrorMessage {...{ error }} />
    );
  }
}

autobind(ErrorPage);

export default changePasswordConnector(ErrorPage);
