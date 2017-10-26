import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import { SubmissionError } from "redux-form";
import SignupForm from "./SignupForm";
import signupConnector from "../../connectors/signup";
import validate from "./SignupValidator";

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
          ...this.props,
          onSignup: this.onSignup,
        }} />
      </div>
    );
  }

  onSignup(props) {
    validate(props);
    return this
      .props
      .onSignup(props)
      .catch((error) => {
        throw new SubmissionError({
          _error: error.message,
        });
      });
  }
}

autobind(Signup);

export default signupConnector(withRouter(Signup));
