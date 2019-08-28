import React, { Component } from "react";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import { warn } from "../validators/proposal";
import { validate, synchronousValidation } from "../validators/submit";
import { withRouter } from "react-router-dom";
import submit from "../connectors/submit";
import appConnector from "../connectors/app";

class SubmitFormContainer extends Component {
  constructor(props) {
    super(props);
    // Provides minor visual feedback when succesfully
    // saving a draft.
    this.state = {
      isDraftSaving: false,
      draftButtonText: "Save as Draft"
    };
  }

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
          onSaveInvoiceDraft: this.onSaveInvoiceDraft,
          isDraftSaving: this.state.isDraftSaving,
          draftButtonText: this.state.draftButtonText
        }}
      />
    );
  }

  onSaveProposalDraft = (...args) => {
    validate(...args);
    const idProposal = this.props.onSaveProposalDraft(...args);
    this.draftButtonTextAnimation(this.props.isCMS, idProposal);
  };

  onSaveInvoiceDraft = (...args) => {
    validate(...args);
    const idInvoice = this.props.onSaveInvoiceDraft(...args);
    this.draftButtonTextAnimation(this.props.isCMS, idInvoice);
  };

  draftButtonTextAnimation = (isCMS, id) => {
    const url = isCMS ? "/invoices/new?draftid=" : "/proposals/new?draftid=";
    this.setState({ isDraftSaving: true, draftButtonText: "✔ saved" });
    setTimeout(() => {
      this.setState({ isDraftSaving: false });
      setTimeout(() => {
        this.setState({ draftButtonText: "Save as Draft" });
        if (this.props.location.search === "")
          this.props.history.replace(url + id);
      }, 500);
    }, 700);
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
