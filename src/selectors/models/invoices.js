// import { createSelector } from "reselect";
import get from "lodash/fp/get";
// import orderBy from "lodash/fp/orderBy";
// import { createDeepEqualSelector } from "../helpers";

export const exchangeRates = get(["invoices", "exchangeRates"]);
