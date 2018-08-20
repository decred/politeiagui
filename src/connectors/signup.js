import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import validate from "../validators/signup";
import { withRouter } from "react-router-dom";
import { SubmissionError } from "redux-form";

const signupFormConnector = connect(
  sel.selectorMap({
    email: sel.email,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    policy: sel.policy,
    newUserResponse: sel.newUserResponse,
    isApiRequestingLogin: sel.isApiRequestingLogin,
    isApiRequestingNewUser: or(sel.isApiRequestingInit, sel.isApiRequestingNewUser),
    isApiRequestingVerifyNewUser: sel.isApiRequestingVerifyNewUser,
    apiNewUserError: sel.apiNewUserError,
    apiVerifyNewUserError: sel.apiVerifyNewUserError,
    isShowingSignupConfirmation: sel.isShowingSignupConfirmation,
    csrf: sel.csrf
  }),
  {
    onFetchData: act.onGetPolicy,
    onSignup: act.onSignup,
    onSignupConfirm: act.onSignupConfirm
  }
);

class Wrapper extends Component {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedInAsEmail) {
      if (this.props.isAdmin) {
        this.props.history.push("/admin/");
      } else {
        this.props.history.push("/user/proposals");
      }
    } else if (nextProps.newUserResponse) {
      nextProps.history.push("/user/signup/next");
    }

    const { hasFetchedPolicy } = this.state;
    if (hasFetchedPolicy)
      return;

    if (nextProps.csrf) {
      this.setState({ hasFetchedPolicy: true });
      this.props.policy || this.props.onFetchData();
    }
  }

  render() {
    const Component = this.props.Component;
    return <Component {...{
      ...this.props,
      onSignup: this.onSignup.bind(this)
    }} />;
  }

  onSignup(args) {
    args = {
      ...args,
      email: (args.email || "").trim()
    };

    const policy = this.props.policy || {};
    validate(policy, args);


    if (!this.props.isShowingSignupConfirmation) {
      return this.props.onSignup();
    }

    const promise = this.props.onSignupConfirm(args);
    if(promise) {
      return promise.catch(e => {
        throw new SubmissionError({
          _error: e.message
        });
      });
    }
  }

}

const wrap = (Component) => signupFormConnector((props) => <Wrapper {...{ ...props, Component }} />);

export default compose(reduxForm({ form: "form/signup" }), withRouter, wrap);
