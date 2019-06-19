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

  render() {
    const Component = this.props.Component;
    return (
      <Component
        {...{
          ...this.props,
          onSaveProposalDraft: this.onSaveProposalDraft,
          onSaveInvoiceDraft: this.onSaveInvoiceDraft
        }}
      />
    );
  }

  onSaveProposalDraft = (...args) => {
    validate(...args);
    const { payload } = this.props.onSaveProposalDraft(...args);
    if (this.props.location.search === "")
      this.props.history.replace("/proposals/new?draftid=" + payload.id);
  };

  onSaveInvoiceDraft = (...args) => {
    validate(...args);
    const { payload } = this.props.onSaveInvoiceDraft(...args);
    if (this.props.location.search === "")
      this.props.history.replace("/invoices/new?draftid=" + payload.id);
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
    form: "form/record",
    touchOnChange: true,
    validate: synchronousValidation,
    enableReinitialize: true,
    destroyOnUnmount: false,
    warn
  }),
  wrap
);
