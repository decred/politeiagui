import { createSelector } from "reselect";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";
import { currentUserID } from "./users";

export const invoicesByToken = get(["invoices", "byToken"]);
export const allInvoicesTokens = get(["invoices", "all"]);

export const exchangeRates = get(["invoices", "exchangeRates"]);

const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);

export const allInvoices = createSelector(
  allInvoicesTokens,
  invoicesByToken,
  (tokens, invByToken) => {
    return sortByNewestFirst(tokens.map((token) => invByToken[token]));
  }
);

export const makeGetInvoicesByUserID = (userID) =>
  createSelector(allInvoices, (invoices) =>
    invoices.filter((inv) => inv.userid === userID)
  );

export const getCurrentUserInvoices = createSelector(
  allInvoices,
  currentUserID,
  (invoices, currUserID) => {
    return invoices.filter((inv) => inv.userid === currUserID);
  }
);

export const makeGetInvoiceByToken = (token) =>
  createSelector(invoicesByToken, get(token));
