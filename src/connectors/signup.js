import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import validate from "../validators/signup";
import { withRouter } from "react-router-dom";

const signupFormConnector = connect(
  sel.selectorMap({
    email: sel.email,
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
    newUserResponse: sel.newUserResponse,
    isApiRequestingLogin: sel.isApiRequestingLogin,
    isApiRequestingNewUser: or(sel.isApiRequestingInit, sel.isApiRequestingNewUser),
    isApiRequestingVerifyNewUser: sel.isApiRequestingVerifyNewUser,
    apiNewUserError: sel.apiNewUserError,
    apiVerifyNewUserError: sel.apiVerifyNewUserError
  }),
  {
    onSignup: act.onSignup,
    onCancelSignup: act.onCancelSignup
  }
);

class Wrapper extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedInAs) {
      if (this.props.isAdmin) {
        this.props.history.push("/admin/");
      } else {
        this.props.history.push("/user/proposals");
      }
    } else if (nextProps.newUserResponse) {
      nextProps.history.push("/user/signup/next");
    }
  }

  render() {
    const Component = this.props.Component;
    return <Component {...{ ...this.props, onSignup: this.onSignup.bind(this) }} />;
  }

  onSignup(...args) {
    console.log("args", args);
    validate(...args);
    return this.props.onSignup(...args);
  }
}

const wrap = (Component) => signupFormConnector((props) => <Wrapper {...{...props, Component }} />);

export default compose(reduxForm({ form: "form/signup" }), withRouter, wrap);
