import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import validate from "../validators/login";
import { withRouter } from "react-router-dom";
import { SubmissionError } from "redux-form";

const loginConnector = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    keyMismatch: sel.getKeyMismatch,
    serverPubkey: sel.serverPubkey,
    email: sel.email,
    isAdmin: sel.isAdmin,
    redirectedFrom: sel.redirectedFrom,
    isApiRequestingLogin: or(sel.isApiRequestingInit, sel.isApiRequestingLogin),
    apiLoginError: sel.apiLoginError
  }),
  {
    onLogin: act.onLogin,
    resetRedirectedFrom: act.resetRedirectedFrom
  }
);

class Wrapper extends Component {
  state = {
    showPrivacyPolicy: false
  };

  onTogglePrivacyPolicy = () =>
    this.setState({ showPrivacyPolicy: !this.state.showPrivacyPolicy });

  onHidePrivacyPolicy = () => this.setState({ showPrivacyPolicy: false });

  render() {
    const Component = this.props.Component;
    return (
      <Component
        {...this.state}
        {...{ ...this.props, onLogin: this.onLogin.bind(this) }}
        onTogglePrivacyPolicy={this.onTogglePrivacyPolicy}
        onHidePrivacyPolicy={this.onHidePrivacyPolicy}
      />
    );
  }

  onLogin(args) {
    args = {
      ...args,
      email: args.email === undefined ? null : args.email.trim()
    };
    validate(args);
    return this.props
      .onLogin(args)
      .then(() => {
        const redirectedFrom = this.props.redirectedFrom;
        if (redirectedFrom) {
          this.props.history.push(redirectedFrom);
        } else if (this.props.isAdmin) {
          this.props.history.push("/admin/");
        } else {
          this.props.history.push("/");
        }
      })
      .catch(e => {
        throw new SubmissionError({
          _error: e.message
        });
      });
  }
}

const wrap = Component =>
  loginConnector(props => <Wrapper {...{ ...props, Component }} />);

export default compose(
  withRouter,
  reduxForm({ form: "form/login" }),
  wrap
);
