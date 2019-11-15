import * as act from "src/actions/types";
import set from "lodash/fp/set";
import update from "lodash/fp/update";
import compose from "lodash/fp/compose";
import union from "lodash/fp/union";

const DEFAULT_STATE = {
  byToken: {},
  all: [],
  exchangeRates: {}
};

const invoiceToken = proposal => proposal.censorshiprecord.token;

const invoiceArrayToByTokenObject = invoices =>
  invoices.reduce(
    (invoicesByToken, invoice) => ({
      ...invoicesByToken,
      [invoiceToken(invoice)]: invoice
    }),
    {}
  );

const invoices = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : ({
        [act.RECEIVE_EXCHANGE_RATE]: () => {
          const { year, month, exchangerate } = action.payload;
          return set(["exchangeRates", `${year}-${month}`], exchangerate)(
            state
          );
        },
        [act.RECEIVE_USER_INVOICES]: () => {
          const { invoices: userInvoices } = action.payload;
          return compose(
            update("byToken", invoices => ({
              ...invoices,
              ...invoiceArrayToByTokenObject(userInvoices)
            })),
            update("all", union(userInvoices.map(invoiceToken)))
          )(state);
        },
        [act.RECEIVE_INVOICE]: () => {
          const { invoice } = action.payload;
          return set(["byToken", invoiceToken(invoice)], invoice)(state);
        }
      }[action.type] || (() => state))();

export default invoices;
