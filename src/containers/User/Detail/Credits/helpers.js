import orderBy from "lodash/fp/orderBy";
import { StatusTag } from "pi-ui";
import React from "react";
import DcrTransactionLink from "src/components/DcrTransactionLink";
import {
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_WAITING
} from "src/constants";
import { formatShortUnixTimestamp, formatUnixTimestamp } from "src/utils";

export const tableHeaders = [
  "Type",
  "Amount",
  "DCRs Paid",
  "Transaction",
  "Status",
  "Date"
];

const manuallyCleared = ["created_by_dbutil", "cleared_by_admin"];

const getRowDataForPurchase = (purchase) => ({
  Type: purchase.type === "fee" ? "Registration Fee" : "Credits",
  Amount: purchase.numberPurchased,
  "DCRs Paid": purchase.price
    ? (purchase.price * purchase.numberPurchased).toFixed(1)
    : 0,
  Transaction: manuallyCleared.includes(purchase.txId) ? (
    purchase.txId
  ) : (
    <DcrTransactionLink txID={purchase.txId} />
  ),
  Status: purchase.confirming ? (
    <StatusTag
      type="bluePending"
      text={`Pending (${purchase.confirmations}/${purchase.paywallConfirmations} confirmations)`}
    />
  ) : (
    <StatusTag type="greenCheck" text="Confirmed" />
  ),
  Date:
    purchase.datePurchased === "just now"
      ? purchase.datePurchased
      : formatShortUnixTimestamp(purchase.datePurchased),
  timestamp:
    purchase.datePurchased === "just now" ? 99999999999 : purchase.datePurchased
});

export const getTableContentFromPurchases = (
  purchases,
  pendingTransaction,
  creditPrice
) =>
  orderBy(
    ["timestamp"],
    ["desc"]
  )(
    purchases.map(getRowDataForPurchase).concat(
      pendingTransaction && pendingTransaction.txID
        ? [
            getRowDataForPurchase({
              numberPurchased: Math.round(
                (pendingTransaction.amount * 1) / (creditPrice * 100000000)
              ),
              price: creditPrice,
              txId: pendingTransaction.txID,
              confirming: true,
              confirmations: pendingTransaction.confirmations,
              paywallConfirmations: pendingTransaction.paywallConfirmations,
              datePurchased: "just now"
            })
          ]
        : []
    )
  ).map((item) => {
    delete item.timestamp;
    return item;
  });

export const getCsvData = (data) =>
  data
    .filter((d) => !d.confirming)
    .map((d) => ({
      ...d,
      datePurchased: d.datePurchased
        ? formatUnixTimestamp(d.datePurchased)
        : "",
      price: d.price,
      type: d.type === "fee" ? "registration fee" : "credits"
    }));

export const getProposalCreditsPaymentStatus = (numOfConfirmations, txid) => {
  if (!txid) {
    return PAYWALL_STATUS_WAITING;
  }
  if (numOfConfirmations < 2) {
    return PAYWALL_STATUS_LACKING_CONFIRMATIONS;
  }
  return PAYWALL_STATUS_PAID;
};
