import { createSelector } from "reselect";
import get from "lodash/fp/get";
import { PAYWALL_STATUS_PAID, PAYWALL_STATUS_WAITING } from "src/constants";

export const paywallByUserID = get(["paywall", "byUserID"]);

export const makeGetPaywallByUserID = (userID) =>
  createSelector(paywallByUserID, get(userID));

export const makeGetUserPaywallStatus = (userID) =>
  createSelector(makeGetPaywallByUserID(userID), (paywall) =>
    paywall ? getUserPaywallStatus(paywall) : null
  );

export const makeGetPaywallCreditPrice = (userID) =>
  createSelector(makeGetPaywallByUserID(userID), (paywall) =>
    paywall ? paywall.creditprice / 100000000 : null
  );

const getUserPaywallStatus = (paywall) => {
  if (paywall.isPaid) {
    return PAYWALL_STATUS_PAID;
  }
  return paywall.status || PAYWALL_STATUS_WAITING;
};

const createPaywallSelector = (userID, key) =>
  createSelector(makeGetPaywallByUserID(userID), (paywall) =>
    paywall ? paywall[key] : null
  );

export const makeGetUserIsPaid = (userID) =>
  createPaywallSelector(userID, "isPaid");

export const makeGetPaywallAddress = (userID) =>
  createPaywallSelector(userID, "paywalladdress");

export const makeGetPaywallTxNotBefore = (userID) =>
  createPaywallSelector(userID, "creditprice");

export const makeGetPaywallTxid = (userID) =>
  createPaywallSelector(userID, "txid");

export const makeGetPaywallAmount = (userID) =>
  createPaywallSelector(userID, "amount");

export const makeGetPaywallConfirmations = (userID) =>
  createPaywallSelector(userID, "confirmations");

export const makeGetPaywallFaucetTxid = (userID) =>
  createPaywallSelector(userID, "faucetTxid");
