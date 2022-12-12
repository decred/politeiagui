import React from "react";
import { StatusTag, Text } from "pi-ui";
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

export function getCreditsTableHeaders() {
  return Object.values(TABLE_HEADERS);
}

export function getCreditsTableData(credits) {
  const rows = groupBy(credits, "datepurchased");
  const data = Object.values(rows).map((row) => ({
    [TABLE_HEADERS.type]: "Credits",
    [TABLE_HEADERS.amount]: row.length,
    [TABLE_HEADERS.dcrspaid]: row.length / 10,
    [TABLE_HEADERS.transaction]: row[0].txid,
    [TABLE_HEADERS.status]: <StatusTag type="greenCheck" text="Confirmed" />,
    [TABLE_HEADERS.date]: formatShortUnixTimestamp(row[0].datepurchased),
  }));

  return data;
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
