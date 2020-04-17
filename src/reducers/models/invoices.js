import * as act from "src/actions/types";
import set from "lodash/fp/set";
import update from "lodash/fp/update";
import compose from "lodash/fp/compose";
import union from "lodash/fp/union";

const DEFAULT_STATE = {
  byToken: {},
  all: [],
  exchangeRates: {},
  subContractors: null,
  newInvoiceToken: null
};

const invoiceToken = (invoice) => invoice.censorshiprecord.token;

const invoiceArrayToByTokenObject = (invoices) =>
  invoices.reduce(
    (invoicesByToken, invoice) => ({
      ...invoicesByToken,
      [invoiceToken(invoice)]: invoice
    }),
    {}
  );

const onReceiveInvoices = (state, receivedInvoices = []) => {
  return compose(
    update("byToken", (invoices) => ({
      ...invoices,
      ...invoiceArrayToByTokenObject(receivedInvoices)
    })),
    update("all", union(receivedInvoices.map(invoiceToken)))
  )(state);
};

const invoices = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_EXCHANGE_RATE]: () => {
            const { year, month, exchangerate } = action.payload;
            return set(
              ["exchangeRates", `${year}-${month}`],
              exchangerate
            )(state);
          },
          [act.RECEIVE_USER_SUBCONTRACTORS]: () => {
            const { users } = action.payload;
            return set("subContractors", users)(state);
          },
          [act.RECEIVE_USER_INVOICES]: () =>
            onReceiveInvoices(state, action.payload.invoices),
          [act.RECEIVE_ADMIN_INVOICES]: () =>
            onReceiveInvoices(state, action.payload.invoices),
          [act.RECEIVE_INVOICE]: () => {
            const { invoice, payout } = action.payload;
            return set(["byToken", invoiceToken(invoice)], {
              ...invoice,
              payout
            })(state);
          },
          [act.RECEIVE_EDIT_INVOICE]: () => {
            const { invoice } = action.payload;
            return set(["byToken", invoiceToken(invoice)], invoice)(state);
          },
          [act.RECEIVE_SETSTATUS_INVOICE]: () => {
            const invoice = action.payload;
            return set(["byToken", invoiceToken(invoice)], invoice)(state);
          },
          [act.RECEIVE_NEW_INVOICE]: () => {
            const invoice = action.payload;
            return set(
              "newInvoiceToken",
              invoice.censorshiprecord.token
            )(state);
          },
          [act.RECEIVE_LOGOUT]: () => DEFAULT_STATE
        }[action.type] || (() => state)
      )();

export default invoices;
