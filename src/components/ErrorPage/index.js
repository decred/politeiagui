import React, { Component } from "react";
import { autobind } from "core-decorators";
import InternalServerErrorMessage from "./InternalServerErrorMessage";
import apiErrorConnector from "../../connectors/apiError";

class ErrorPage extends Component {
  componentDidMount() {
    const { apiError, history } = this.props;
    if (!apiError) {
      history.goBack();
    }
  }
  render() {
    const { apiError } = this.props;
    return <InternalServerErrorMessage error={apiError && apiError.message} />;
  }
}

autobind(ErrorPage);

export default apiErrorConnector(ErrorPage);
