import React, { Component } from "react";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import { warn } from "../validators/proposal";
import { validate, synchronousValidation } from "../validators/submit";
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
    return (
      <Component
        {...{
          ...this.props,
          onSaveDraft: this.onSaveDraft,
          onSave: this.onSave
        }}
      />
    );
  }

  onSave = (...args) => {
    try {
      validate(...args);
    } catch (e) {
      this.setState({ validationError: e.errors._error });
      return;
    }
    return this.props.onSave(...args);
  };

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
  appConnector,
  reduxForm({
    form: "form/proposal",
    initialValues: { month: 1, year: 2019 },
    touchOnChange: true,
    validate: synchronousValidation,
    enableReinitialize: true,
    warn
  }),
  withRouter,
  wrap
);
