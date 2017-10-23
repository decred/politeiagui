import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import LoginForm from "./LoginForm";
import CurrentUser from "./CurrentUser";
import loginConnector from "../../connectors/login";

class Login extends Component {
  componentWillUnmount() {
    this.props.onResetNewUser();
  }

  render() {
    return (
      <div className="login-form">
        {this.props.loggedInAs ? (
          <CurrentUser />
        ) : (
          <LoginForm {...{
            onLogin: this.onLogin
          }} />
        )}
      </div>
    );
  }

  onLogin(...args) {
    this.props.onLogin(...args)
      .then(() => {
        if(this.props.isAdmin) {
          this.props.history.push("/admin/unreviewed");
        }
        else {
          this.props.history.push("/proposals/new");
        }
      });
  }
}

autobind(Login);

export default loginConnector(withRouter(Login));
