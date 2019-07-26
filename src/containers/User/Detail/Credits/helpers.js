import React from "react";
import orderBy from "lodash/fp/orderBy";
import { StatusTag } from "pi-ui";
import { formatUnixTimestamp } from "src/utilsv2";
import DcrTransactionLink from "src/componentsv2/DcrTransactionLink";
import {
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_WAITING
} from "src/constants";

export const tableHeaders = [
  "Type",
  "Amount",
  "DCRs Paid",
  "Transaction",
  "Status",
  "Date"
];

const getRowDataForCreditsPurchase = purchase => ({
  Type: "Credits",
  Amount: purchase.numberPurchased,
  "DCRs Paid": purchase.price,
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
      : formatUnixTimestamp(purchase.datePurchased)
});

export const getTableContentFromPurchases = (
  proposalCreditPurchases,
  pendingTransaction,
  creditPrice
) =>
  orderBy(["Date"], ["desc"])(
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
  );

export const getCsvData = data =>
  data
    .filter(d => !d.confirming)
    .map(d => ({
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
