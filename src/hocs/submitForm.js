import React, { Component } from "react";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import { warn } from "../validators/proposal";
import { validate, synchronousValidation } from "../validators/submit";
import { withRouter } from "react-router-dom";
import submit from "../connectors/submit";
import appConnector from "../connectors/app";

class SubmitFormContainer extends Component {
  componentDidMount() {
    this.props.policy || this.props.onFetchData();
  }

  componentDidUpdate() {
    const { token } = this.props;
    if (token) {
      this.props.onResetInvoice();
      return this.props.isCMS
        ? this.props.history.push("/invoices/" + token)
        : this.props.history.push("/proposals/" + token);
    }
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
    console.log("aqui:", args);
    try {
      validate(...args);
    } catch (e) {
      this.setState({ validationError: e.errors._error });
      return;
    }
    console.log("to aq");
    return this.props.isCMS
      ? this.props.onSaveInvoice(...args)
      : this.props.onSaveProposal(...args);
  };

  onSaveDraft = (...args) => {
    validate(...args);
    this.props.onSaveDraft(...args);
    this.props.history.push("/user/proposals/drafts");
  };
}

const wrap = Component => props => (
  <SubmitFormContainer {...{ ...props, Component }} />
);

export default compose(
  submit,
  appConnector,
  withRouter,
  reduxForm({
    form: "form/proposal",
    initialValues: { month: 1, year: 2019 },
    touchOnChange: true,
    validate: synchronousValidation,
    enableReinitialize: true,
    warn
  }),
  wrap
);
