import React, { Component } from "react";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import validate from "../validators/signup";
import { withRouter } from "react-router-dom";
import { SubmissionError } from "redux-form";
import signupConnector from "../connectors/signup";
import signupCMSConnector from "../connectors/signupCMS";
import appConnector from "../connectors/app";

class SignupFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasFetchedPolicy: false
    };
  }

  componentDidMount() {
    if (this.props.csrf) {
      this.props.policy || this.props.onFetchData();
    }
  }

  componentDidUpdate() {
    if (this.props.loggedInAsEmail) {
      if (this.props.isAdmin) {
        this.props.history.push("/admin/");
      } else {
        this.props.history.push("/user/proposals");
      }
    } else if (this.props.newUserResponse) {
      this.props.history.push("/user/signup/next");
    }

    const { hasFetchedPolicy } = this.state;
    if (hasFetchedPolicy) return;

    if (this.props.csrf) {
      this.setState({ hasFetchedPolicy: true });
      this.props.policy || this.props.onFetchData();
    }
  }

  componentWillUnmount() {
    if (this.props.isShowingSignupConfirmation) {
      this.props.onResetSignup();
    }
  }

  onSignup(args) {
    args = {
      ...args,
      email: (args.email || "").trim()
    };

    const policy = this.props.policy || {};
    validate(policy, args, this.props.isCMS);
    const { error } = this.props;
    if (error) {
      this.props.clearSubmitErrors();
    }

    if (!this.props.isShowingSignupConfirmation && !this.props.isCMS) {
      return this.props.onSignup();
    }

    const promise = this.props.onSignupConfirm(args);
    if (promise) {
      return promise.catch(e => {
        throw new SubmissionError({
          _error: e.message
        });
      });
    }
  }

  render() {
    const Component = this.props.Component;
    return (
      <Component
        {...{
          ...this.props,
          onSignup: this.onSignup.bind(this)
        }}
      />
    );
  }
}

const wrap = Component =>
  appConnector(props => {
    const connector = props.isCMS ? signupCMSConnector : signupConnector;
    const Comp = connector(otherProps => (
      <SignupFormContainer {...{ ...otherProps, ...props, Component }} />
    ));
    return <Comp />;
  });

export default compose(
  reduxForm({ form: "form/signup" }),
  withRouter,
  wrap
);
