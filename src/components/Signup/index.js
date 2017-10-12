import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import SignupForm from "./SignupForm";
import loginConnector from "../../connectors/login";

class Signup extends Component {
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
        <SignupForm {...{
          onSignup: this.onSignup,
          hideCancel: this.props.signup
        }} />
      </div>
    );
  }

  onSignup(props) {
    this.props.onSignup(props);
  }
}

autobind(Signup);

export default loginConnector(withRouter(Signup));
