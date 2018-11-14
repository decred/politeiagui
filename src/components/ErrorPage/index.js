import React, { Component } from "react";
import { autobind } from "core-decorators";
import InternalServerErrorMessage from "./InternalServerErrorMessage";

class ErrorPage extends Component {
  render() {
    const params =
      this.props.location && new URLSearchParams(this.props.location.search);
    const error = params.get("error");
    return <InternalServerErrorMessage error={error} />;
  }
}

autobind(ErrorPage);

export default ErrorPage;
