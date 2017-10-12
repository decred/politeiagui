import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import CurrentUser from "./CurrentUser";
import loginConnector from "../../connectors/login";

class Login extends Component {
  componentWillUnmount() {
    this.props.onResetNewUser();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newUserResponse) {
      nextProps.history.push("/user/signup/next");
    }
  }

  render() {
    return (
      <div className="login-form">
        {this.props.loggedInAs ? (
          <CurrentUser />
        ) : this.props.signup || this.props.isShowingSignup ? (
          <SignupForm {...{
            onSignup: this.onSignup,
            hideCancel: this.props.signup
          }} />
        ) : (
          <LoginForm {...{
            onLogin: this.onLogin
          }} />
        )}
      </div>
    );
  }

  onSignup() {
    const { password, passwordVerify } = this.state;
    if (!password || password !== passwordVerify || !this.props.email) return;
    this.props.onSignup(this.state.password);
    this.setState({ password: "", passwordVerify: "" });
  }

  onLogin(props) {
    this.props.onLogin(props);
  }
}

autobind(Login);

export default loginConnector(withRouter(Login));
