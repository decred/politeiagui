import React, { Component } from "react";
import Loading from "./snew/Loading";
import ErrorPage from "./ErrorPage";
import logoutConnector from "../connectors/logout";

class LogoutPage extends Component {
  componentDidMount() {
    this.props.onLogout();
  }

  render() {
    const { isLoading, error } = this.props;
    return isLoading ? (
      <Loading style={{minHeight: "500px"}} />
    ) : error ? (
      <ErrorPage {...{ error }} />
    ) : (
      <article className="page logout-page">
        <h2>Successfully Logged Out</h2>
      </article>
    );
  }
}

export default logoutConnector(LogoutPage);
