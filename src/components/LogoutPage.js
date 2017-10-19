import React, { Component } from "react";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import logoutConnector from "../connectors/logout";

class LogoutPage extends Component {
  componentDidMount() {
    this.props.onLogout();
  }

  render() {
    const { isLoading, error } = this.props;
    return isLoading ? <LoadingPage /> : error ? <ErrorPage {...{ error }} /> : (
      <article className="page logout-page">
        <h2>Successfully Logged Out</h2>
      </article>
    );
  }
}

export default logoutConnector(LogoutPage);
