import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const signupNextConnector = connect(
  sel.selectorMap({
    email: sel.newUserEmail,
  }),
  dispatch => bindActionCreators({
    onResetNewUser: act.onResetNewUser,
  }, dispatch)
);

class Wrapper extends Component {

  componentWillUnmount() {
    this.props.onResetNewUser();
  }

  render () {
    const { Component, ...props } = this.props;
    return <Component {...{ ...props }} />;
  }
}

const wrap = (Component) => signupNextConnector(props => <Wrapper {...{...props, Component}} />);
export default wrap;

