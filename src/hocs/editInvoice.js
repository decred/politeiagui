import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import { validate } from "../validators/invoice";
import { arg, or } from "../lib/fp";

const editInvoiceConnector = connect(
  sel.selectorMap({
    token: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "token"]),
      arg(1)
    ),
    editedInvoiceToken: sel.editInvoiceToken,
    submitError: sel.apiEditInvoiceError,
    invoice: sel.invoice,
    initialValues: or(sel.getEditInvoiceValues),
    isLoading: or(sel.isLoadingSubmit, sel.isApiRequestingEditInvoice),
    loggedInAsEmail: sel.loggedInAsEmail,
    userCanExecuteActions: sel.userCanExecuteActions,
    policy: sel.policy,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    keyMismatch: sel.getKeyMismatch
  }),
  {
    onFetchData: act.onGetPolicy,
    onFetchInvoice: act.onFetchInvoice,
    onResetInvoice: act.onResetInvoice,
    onSave: act.onEditInvoice
  }
);

class EditInvoiceContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validationError: ""
    };
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

    const isInvoiceFetched =
      invoice &&
      invoice.censorshiprecord &&
      invoice.censorshiprecord.token === this.props.token;
    const invoiceBelongsToTheUser =
      invoice && invoice.userid === this.props.userid;
    if (isInvoiceFetched && !invoiceBelongsToTheUser) {
      this.props.history.push("/");
    }
  }

  componentWillUnmount() {
    this.props.onResetInvoice();
  }

  render() {
    const Component = this.props.Component;
    return (
      <Component
        {...{
          ...this.props,
          validationError: this.state.validationError,
          editingMode: true,
          onSave: this.onSave,
          onCancel: this.onCancel
        }}
      />
    );
  }

  onSave = (...args) => {
    try {
      validate(...args);
      this.props.onSave(...args, this.props.token);
    } catch (e) {
      this.setState({ validationError: e.errors._error });
    }
  };

  onCancel = () => this.props.history.push("/user/invoices");
}

const wrap = Component => props => (
  <EditInvoiceContainer {...{ ...props, Component }} />
);

export default compose(
  editInvoiceConnector,
  withRouter,
  wrap
);
