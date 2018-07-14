import React, { Component } from "react";
import PageLoadingIcon from "./snew/PageLoadingIcon";
import logoutConnector from "../connectors/logout";

class LogoutPage extends Component {
  componentDidMount() {
    this.props.onLogout();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.error && nextProps.error) {
      this.props.history.push(`/500?error=${nextProps.error.message}`);
    }
  }

  render() {
    const { isLoading } = this.props;
    return isLoading ? (
      <PageLoadingIcon />
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
