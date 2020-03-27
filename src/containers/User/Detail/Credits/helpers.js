import orderBy from "lodash/fp/orderBy";
import { StatusTag } from "pi-ui";
import React from "react";
import DcrTransactionLink from "src/components/DcrTransactionLink";
import {
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_WAITING
} from "src/constants";
import { formatShortUnixTimestamp, formatUnixTimestamp } from "src/utilsv2";

export const tableHeaders = [
  "Type",
  "Amount",
  "DCRs Paid",
  "Transaction",
  "Status",
  "Date"
];

const getRowDataForCreditsPurchase = (purchase) => ({
  Type: "Credits",
  Amount: purchase.numberPurchased,
  "DCRs Paid": purchase.price
    ? (purchase.price * purchase.numberPurchased).toFixed(1)
    : 0,
  Transaction:
    purchase.txId === "created_by_dbutil" ? (
      purchase.txId
    ) : (
      <DcrTransactionLink txID={purchase.txId} />
    ),
  Status: purchase.confirming ? (
    <StatusTag type="bluePending" text="Pending" />
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
  proposalCreditPurchases,
  pendingTransaction,
  creditPrice
) =>
  orderBy(
    ["timestamp"],
    ["desc"]
  )(
    proposalCreditPurchases.map(getRowDataForCreditsPurchase).concat(
      pendingTransaction && pendingTransaction.txID
        ? [
            getRowDataForCreditsPurchase({
              numberPurchased: Math.round(
                (pendingTransaction.amount * 1) / (creditPrice * 100000000)
              ),
              price: creditPrice,
              txId: pendingTransaction.txID,
              confirming: true,
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
      price: d.type === "fee" ? "" : d.price,
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
