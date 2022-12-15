import React from "react";
import { Link, StatusTag, Text } from "pi-ui";
// FP
import groupBy from "lodash/groupBy";
// Regular
import isEmpty from "lodash/isEmpty";
import isBoolean from "lodash/isBoolean";
import { formatShortUnixTimestamp } from "@politeiagui/common-ui/utils";

const TABLE_HEADERS = {
  type: "Type",
  amount: "Amount",
  dcrspaid: "DCRs Paid",
  transaction: "Transaction",
  status: "Status",
  date: "Date",
};

const TxLink = ({ txid, isTestnet = true }) => (
  <Link
    target="_blank"
    rel="noopener noreferrer"
    href={`https://${isTestnet ? "testnet" : "dcrdata"}.decred.org/tx/${txid}`}
  >
    {txid}
  </Link>
);

export function getCreditsTableHeaders() {
  return Object.values(TABLE_HEADERS);
}

export function getCreditsTableData(credits, creditPriceDCR = 0.1) {
  const rows = groupBy(credits, "datepurchased");
  const data = Object.values(rows).map((row) => ({
    [TABLE_HEADERS.type]: "Credits",
    [TABLE_HEADERS.amount]: row.length,
    [TABLE_HEADERS.dcrspaid]: row.length * creditPriceDCR,
    [TABLE_HEADERS.transaction]: row[0].txid,
    [TABLE_HEADERS.status]: "confirmed",
    [TABLE_HEADERS.date]: formatShortUnixTimestamp(row[0].datepurchased),
  }));

  return data;
}

export function getFeeTableData({ feePriceDCR, timestamp, txid }) {
  return {
    [TABLE_HEADERS.type]: "Registration Fee",
    [TABLE_HEADERS.amount]: 1,
    [TABLE_HEADERS.dcrspaid]: feePriceDCR,
    [TABLE_HEADERS.transaction]: txid,
    [TABLE_HEADERS.status]: "confirmed",
    [TABLE_HEADERS.date]: formatShortUnixTimestamp(timestamp),
  };
}

export function formatDataToTable(data) {
  return data.map((item) => ({
    ...item,
    // TODO: Use correct testnet/mainnet environment
    [TABLE_HEADERS.transaction]: (
      <TxLink txid={item[TABLE_HEADERS.transaction]} />
    ),
    [TABLE_HEADERS.status]: <StatusTag type="greenCheck" text="Confirmed" />,
  }));
}

function formatItemValue(value) {
  return isBoolean(value) ? (
    value ? (
      "Yes"
    ) : (
      "No"
    )
  ) : isEmpty(value) ? (
    <Text color="gray">No information provided</Text>
  ) : (
    value
  );
}

export function formatItemsList(items) {
  return items.map(({ label, value }) => ({
    label,
    value: formatItemValue(value),
  }));
}
