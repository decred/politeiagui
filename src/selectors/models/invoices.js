import { createSelector } from "reselect";
import get from "lodash/fp/get";
import { currentUserID } from "./users";

export const invoicesByToken = get(["invoices", "byToken"]);
export const allInvoicesTokens = get(["invoices", "all"]);

export const exchangeRates = get(["invoices", "exchangeRates"]);

export const allInvoices = createSelector(
  allInvoicesTokens,
  invoicesByToken,
  (tokens, invByToken) => {
    return tokens.map(token => invByToken[token]);
  }
);

export const makeGetInvoicesByUserID = userID =>
  createSelector(
    allInvoices,
    invoices => invoices.filter(inv => inv.userid === userID)
  );

export const getCurrentUserInvoices = createSelector(
  allInvoices,
  currentUserID,
  (invoices, currUserID) => {
    return invoices.filter(inv => inv.userid === currUserID);
  }
);

export const makeGetInvoiceByToken = token =>
  createSelector(
    invoicesByToken,
    get(token)
  );
