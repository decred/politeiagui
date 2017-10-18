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
    console.log("this.props", this.props);
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

  onLogin(props) {
    this.props.onLogin(props);
  }
}

autobind(Login);

export default loginConnector(withRouter(Login));
