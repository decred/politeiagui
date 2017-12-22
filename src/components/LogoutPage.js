import React, { Component } from "react";
import PageLoadingIcon from "./snew/PageLoadingIcon";
import ErrorPage from "./ErrorPage";
import logoutConnector from "../connectors/logout";
import {PaywallModal} from "./Modals";

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
      <article className="page logout-page">
        <h2>Successfully Logged Out</h2>
        {/* temp */}
        <PaywallModal/>
        <button>trigger</button>
      </article>
    );
  }
}

export default logoutConnector(LogoutPage);
