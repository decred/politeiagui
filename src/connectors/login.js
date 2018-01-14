import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import validate from "../validators/login";
import { withRouter } from "react-router-dom";

const loginConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    loggedIn: sel.loggedIn,
    email: sel.email,
    userid: sel.userid,
    isAdmin: sel.isAdmin,
    redirectedFrom: sel.redirectedFrom,
    isApiRequestingLogin: or(sel.isApiRequestingInit, sel.isApiRequestingLogin),
    apiLoginError: sel.apiLoginError
  }),
  {
    onLogin: act.onLogin,
    resetRedirectedFrom: act.resetRedirectedFrom,
  }
);

class Wrapper extends Component {
  componentWillReceiveProps({ loggedInAs, redirectedFrom, resetRedirectedFrom, history }) {
    if (loggedInAs && redirectedFrom) {
      resetRedirectedFrom();
      history.push(redirectedFrom);
    }
  }

  render() {
    const Component = this.props.Component;
    return <Component {...{ ...this.props, onLogin: this.onLogin.bind(this) }} />;
  }

  onLogin(...args) {
    validate(...args);
    return this.props.onLogin(...args).then(() => {
      if (this.props.isAdmin) {
        this.props.history.push("/admin/");
      } else {
        this.props.history.push(`/user/${this.props.userid}/proposals`);
      }
    });
  }
}

const wrap = (Component) => loginConnector((props) => <Wrapper {...{...props, Component }} />);

export default compose(withRouter, reduxForm({ form: "form/login" }), wrap);
