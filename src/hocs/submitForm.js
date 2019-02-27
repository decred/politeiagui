import React, { Component } from "react";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import { validate, synchronousValidation, warn } from "../validators/proposal";
import { withRouter } from "react-router-dom";
import submitProposal from "../connectors/submitProposal";
import submitInvoice from "../connectors/submitInvoice";
import appConnector from "../connectors/app";

class SubmitFormContainer extends Component {
  componentDidMount() {
    this.props.policy || this.props.onFetchData();
  }

  render() {
    const Component = this.props.Component;
    return <Component {...{ ...this.props, onSaveDraft: this.onSaveDraft }} />;
  }

  onSaveDraft = (...args) => {
    validate(...args);
    this.props.onSaveDraft(...args);
    this.props.history.push("/user/proposals/drafts");
  };
}

const wrap = Component =>
  appConnector(props => {
    const connector = props.isCMS ? submitInvoice : submitProposal;
    const Comp = connector(otherProps => (
      <SubmitFormContainer {...{ ...otherProps, ...props, Component }} />
    ));
    return <Comp />;
  });

export default compose(
  reduxForm({
    form: "form/proposal",
    touchOnChange: true,
    validate: synchronousValidation,
    enableReinitialize: true,
    warn
  }),
  withRouter,
  wrap
);
