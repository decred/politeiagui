import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { or } from "../lib/fp";
import { validate } from "../validators/invoice";
import {
  createNewRow,
  createTableHeaders
} from "../components/InvoiceDatasheet/helpers";

// XXX: connector needs to be moved in its own file
const newInvoiceConnector = connect(
  sel.selectorMap({
    isLoading: or(sel.isLoadingSubmit, sel.newProposalIsRequesting),
    description: sel.newProposalDescription,
    error: sel.newInvoiceError,
    submitError: sel.newInvoiceError,
    token: sel.newInvoiceToken
  }),
  {
    onFetchData: act.onGetPolicy,
    onSave: act.onSaveNewInvoice,
    onResetInvoice: act.onResetInvoice
  }
);

class NewInvoiceContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: {
        month: 1,
        year: 2019,
        datasheet: [createTableHeaders(), createNewRow(1)]
      },
      validationError: ""
    };
  }

  componentDidUpdate() {
    const { token, onResetInvoice } = this.props;
    if (token) {
      onResetInvoice();
      return this.props.history.push("/invoices/" + token);
    }
  }

  render() {
    const { Component } = this.props;
    const { validationError } = this.state;
    return (
      <Component
        {...{
          ...this.props,
          onSave: this.onSaveInvoice.bind(this),
          initialValues: this.state.initialValues,
          validationError: validationError,
          onChange: this.onChange
        }}
      />
    );
  }

  onChange = () => {
    this.setState({ validationError: "" });
  };

  onSaveInvoice = (...args) => {
    try {
      validate(...args);
    } catch (e) {
      this.setState({ validationError: e.errors._error });
      return;
    }
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
