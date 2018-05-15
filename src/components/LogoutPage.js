import React, { Component } from "react";
import PageLoadingIcon from "./snew/PageLoadingIcon";
import ErrorPage from "./ErrorPage";
import logoutConnector from "../connectors/logout";

class LogoutPage extends Component {
  componentDidMount() {
    this.props.onLogout();
  }

  render() {
    const { isLoading, error } = this.props;
    return isLoading ? (
      <PageLoadingIcon />
    ) : error ? (
      <ErrorPage {...{ error }} />
    ) : (
      <article className="page logout-page content">
        <h3>You are now logged out. Thanks for stopping by, and have a great day.</h3>
        <p>Here are some links that might be useful for you:</p>
        <ul>
          <li><a href="/user/signup">Log back in</a></li>
          <li><a href="https://www.decred.org/">decred.org</a></li>
          <li><a href="https://github.com/decred/politeia">Politeia</a> and <a href="https://github.com/decred/politeiagui">PoliteiaGUI</a> on Github</li>
        </ul>
      </article>
    );
  }
}

export default logoutConnector(LogoutPage);
