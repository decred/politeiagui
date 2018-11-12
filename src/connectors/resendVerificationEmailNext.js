import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const resendVerificationEmailNextConnector = connect(
  sel.selectorMap({
    email: sel.emailForResendVerification
  }),
  dispatch =>
    bindActionCreators(
      {
        resetResendVerificationEmail: act.resetResendVerificationEmail
      },
      dispatch
    )
);

class Wrapper extends Component {
  componentWillUnmount() {
    this.props.resetResendVerificationEmail();
  }

  render() {
    const { Component, ...props } = this.props;
    return <Component {...{ ...props }} />;
  }
}

const wrap = Component =>
  resendVerificationEmailNextConnector(props => (
    <Wrapper {...{ ...props, Component }} />
  ));
export default wrap;
