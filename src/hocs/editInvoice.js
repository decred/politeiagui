import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import { arg, or } from "../lib/fp";
import { fromUSDCentsToUSDUnits } from "../helpers";
import { lineitemsWithSubtotal } from "../components/InvoiceDatasheet/helpers";

const editInvoiceConnector = connect(
  sel.selectorMap({
    token: compose(
      (t) => (t ? t.toLowerCase() : t),
      get(["match", "params", "token"]),
      arg(1)
    ),
    editedInvoiceToken: sel.editInvoiceToken,
    submitError: sel.apiEditInvoiceError,
    invoice: sel.invoice,
    otherFiles: sel.getNotJSONFile,
    isLoading: or(sel.isLoadingSubmit, sel.isApiRequestingEditInvoice),
    loggedInAsEmail: sel.loggedInAsEmail,
    userCanExecuteActions: sel.userCanExecuteActions,
    policy: sel.policy,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    keyMismatch: sel.getKeyMismatch,
    month: sel.invoiceFormMonth,
    year: sel.invoiceFormYear,
    exchangeRate: sel.exchangeRate,
    loadingExchangeRate: sel.isApiRequestingExchangeRate,
    exchangeRateError: sel.apiExchangeRateError
  }),
  {
    onFetchData: act.onGetPolicy,
    onFetchInvoice: act.onFetchInvoice,
    onResetInvoice: act.onResetInvoice,
    onSave: act.onEditInvoice,
    onFetchExchangeRate: act.onFetchExchangeRate,
    onDeleteDraftInvoice: act.onDeleteDraftInvoice
  }
);

class EditInvoiceContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { token } = this.props;
    this.props.policy || this.props.onFetchData();
    this.props.onFetchInvoice && this.props.onFetchInvoice(token);
  }

  componentDidUpdate() {
    const { editedInvoiceToken, invoice } = this.props;
    if (editedInvoiceToken) {
      this.props.onResetInvoice();
      return this.props.history.push("/invoices/" + editedInvoiceToken);
    }
    const isUserIDFetched = this.props.userid !== null ? true : false;
    const isInvoiceFetched =
      invoice &&
      invoice.censorshiprecord &&
      invoice.censorshiprecord.token === this.props.token;
    const invoiceBelongsToTheUser =
      invoice && invoice.userid === this.props.userid;
    if (isInvoiceFetched && !this.state.initialValues) {
      const { input } = invoice;
      this.setState({
        initialValues: {
          month: input.month,
          year: input.year,
          name: input.contractorname,
          contact: input.contractorcontact,
          location: input.contractorlocation,
          rate: fromUSDCentsToUSDUnits(input.contractorrate),
          address: input.paymentaddress,
          lineitems: lineitemsWithSubtotal(
            input.lineitems,
            input.contractorrate
          ),
          files: this.props.otherFiles
        }
      });
    }
    if (isInvoiceFetched && isUserIDFetched && !invoiceBelongsToTheUser) {
      this.props.history.push("/");
    }
  }

  render() {
    const Component = this.props.Component;
    return (
      <Component
        {...{
          ...this.props,
          validationError: this.state.validationError,
          initialValues: this.state.initialValues,
          editingMode: true,
          onSave: this.onSave,
          onCancel: this.onCancel
        }}
      />
    );
  }

  onSave = (...args) => {
    const { exchangeRate } = this.props;
    args[0].exchangerate = exchangeRate;
    this.props.onSave(...args, this.props.token);
  };

  onCancel = () => this.props.history.push(`/invoices/${this.props.token}`);
}

const wrap = (Component) => (props) => (
  <EditInvoiceContainer {...{ ...props, Component }} />
);

export default compose(editInvoiceConnector, wrap);
