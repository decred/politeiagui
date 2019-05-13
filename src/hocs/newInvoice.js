import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { or } from "../lib/fp";
import { generateBlankLineItem } from "../components/InvoiceDatasheet/helpers";
import { getCurrentYear, getCurrentMonth } from "../helpers";

// XXX: connector needs to be moved in its own file
const newInvoiceConnector = connect(
  sel.selectorMap({
    isLoading: or(sel.isLoadingSubmit, sel.newInvoiceIsRequesting),
    description: sel.newProposalDescription,
    error: sel.newInvoiceError,
    submitError: sel.newInvoiceError,
    policy: sel.policy,
    token: sel.newInvoiceToken,
    month: sel.invoiceFormMonth,
    year: sel.invoiceFormYear,
    exchangeRate: sel.exchangeRate,
    loadingExchangeRate: sel.isApiRequestingExchangeRate,
    exchangeRateError: sel.apiExchangeRateError,
    draftInvoiceById: sel.draftInvoiceById,
    draftInvoice: sel.draftInvoiceById
  }),
  {
    onFetchData: act.onGetPolicy,
    onSave: act.onSaveNewInvoice,
    onResetInvoice: act.onResetInvoice,
    onFetchExchangeRate: act.onFetchExchangeRate,
    onSaveInvoiceDraft: act.onSaveDraftInvoice,
    onDeleteDraftInvoice: act.onDeleteDraftInvoice
  }
);

class NewInvoiceContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: props.draftInvoice || {
        month: getCurrentMonth() - 1,
        year: getCurrentYear(),
        lineitems: [generateBlankLineItem()]
      }
    };
  }

  componentDidUpdate(prevProps) {
    const { token, onResetInvoice, draftInvoice } = this.props;
    if (token) {
      if (this.props.draftInvoiceById) {
        this.props.onDeleteDraftInvoice(this.props.draftInvoiceById.draftId);
      }
      onResetInvoice();
      return this.props.history.push("/invoices/" + token);
    }
    const draftInvoiceDataAvailable = !prevProps.draftInvoice && draftInvoice;
    if (draftInvoiceDataAvailable) {
      this.setState({
        initialValues: draftInvoice
      });
    }
  }

  render() {
    const { Component } = this.props;
    return (
      <Component
        {...{
          ...this.props,
          onSave: this.onSaveInvoice.bind(this),
          initialValues: this.state.initialValues,
          onChange: this.onChange
        }}
      />
    );
  }

  onSaveInvoice = (...args) => {
    const { exchangeRate } = this.props;
    args[0].exchangerate = exchangeRate;
    return this.props.onSave(...args);
  };
}

const wrap = Component => props => (
  <NewInvoiceContainer {...{ ...props, Component }} />
);

export default compose(
  newInvoiceConnector,
  wrap
);
