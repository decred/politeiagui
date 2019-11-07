import * as act from "src/actions/types";
import set from "lodash/fp/set";
// import update from "lodash/fp/update";

const DEFAULT_STATE = {
  byId: {},
  exchangeRates: {}
};

const invoices = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : ({
        [act.RECEIVE_EXCHANGE_RATE]: () => {
          const { year, month, exchangerate } = action.payload;
          return set(["exchangeRates", `${year}-${month}`], exchangerate)(
            state
          );
        }
      }[action.type] || (() => state))();

export default invoices;
