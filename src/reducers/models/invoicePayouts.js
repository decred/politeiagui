import * as act from "src/actions/types";
import { set } from "lodash/fp";

const DEFAULT_STATE = {
  payouts: [],
  payoutSummaries: []
};

const invoicePayouts = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_GENERATE_PAYOUTS]: () =>
            set("payouts", action.payload.payouts)(state),
          [act.RECEIVE_INVOICE_PAYOUTS]: () =>
            set("payoutSummaries", action.payload.invoices)(state),
          [act.RECEIVE_LOGOUT]: () => DEFAULT_STATE
        }[action.type] || (() => state)
      )();

export default invoicePayouts;
