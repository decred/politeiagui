import React, { Component } from "react";
import PageLoadingIcon from "./snew/PageLoadingIcon";
import logoutConnector from "../connectors/logout";

class LogoutPage extends Component {
  componentDidMount() {
    this.props.onLogout();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.error && this.props.error) {
      this.props.history.push(`/500?error=${this.props.error.message}`);
    }
  }

  render() {
    const { isLoading } = this.props;
    return isLoading ? (
      <PageLoadingIcon />
    ) : (
      <div className="content" role="main">
        <div className="page logout-page">
          <h1>Logged out</h1>
          <h3>Thanks for stopping by, and have a great day.</h3>
          <p>Here are some links that might be useful for you:</p>
          <div className="logout-links">
            <div className="item-link">
              <div><span className="fa fa-user fa-2x" aria-hidden="true"></span></div>
              <div><a href="/user/signup"> log back in</a></div>
            </div>
            <div className="item-link">
              <div><span className="fa fa-home fa-2x" aria-hidden="true"></span></div>
              <div><a href="https://www.decred.org/"> decred.org</a></div>
            </div>
            <div className="item-link">
              <div><span className="fa fa-github fa-2x" aria-hidden="true"></span></div>
              <div><a href="https://github.com/decred/politeia"> politeia</a> and <a href="https://github.com/decred/politeiagui">politeiagui</a></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default logoutConnector(LogoutPage);
