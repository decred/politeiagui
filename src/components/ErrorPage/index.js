import React, { Component } from "react";
import { autobind } from "core-decorators";
import InternalServerErrorMessage from "./InternalServerErrorMessage";
import errorPageConnector from "../../connectors/errorPage";

class ErrorPage extends Component {

  render() {
    const { error } = this.props;
    return (
      <InternalServerErrorMessage {...{ error }} />
    );
  }
}

autobind(ErrorPage);

export default errorPageConnector(ErrorPage);
