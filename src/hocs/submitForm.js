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
      isDraftSaving: false
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
          isDraftSaving: this.state.isDraftSaving
        }}
      />
    );
  }

  onSaveProposalDraft = (...args) => {
    validate(...args);
    const { payload } = this.props.onSaveProposalDraft(...args);
    this.setState({ isDraftSaving: true });
    setTimeout(() => {
      this.setState({ isDraftSaving: false });
      if (this.props.location.search === "")
        this.props.history.replace("/proposals/new?draftid=" + payload.id);
    }, 700);
  };

  onSaveInvoiceDraft = (...args) => {
    validate(...args);
    const { payload } = this.props.onSaveInvoiceDraft(...args);
    this.setState({ isDraftSaving: true });
    setTimeout(() => {
      this.setState({ isDraftSaving: false });
      if (this.props.location.search === "")
        this.props.history.replace("/invoices/new?draftid=" + payload.id);
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
