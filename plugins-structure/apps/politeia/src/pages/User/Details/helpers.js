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

export function getCreditsTableData(credits, creditPriceDCR = 1 / 10) {
  const rows = groupBy(credits, "txid");
  const data = Object.values(rows)
    .sort((a, b) => b[0].datepurchased - a[0].datepurchased)
    .map((row) => ({
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
  return items
    .filter(({ hide }) => !hide)
    .map(({ label, value }) => ({
      label,
      value: formatItemValue(value),
    }));
}

// User Preferences
const PREF_MY_PROPOSAL_STATUS_CHANGE = 1 << 0;
const PREF_MY_PROPOSAL_VOTE_STARTED = 1 << 1;
const PREF_REGULAR_PROPOSAL_VETTED = 1 << 2;
const PREF_REGULAR_PROPOSAL_EDITED = 1 << 3;
const PREF_REGULAR_PROPOSAL_VOTE_STARTED = 1 << 4;
const PREF_ADMIN_PROPOSAL_NEW = 1 << 5;
const PREF_ADMIN_PROPOSAL_VOTE_AUTHORIZED = 1 << 6;
const PREF_COMMENT_ON_MY_PROPOSAL = 1 << 7;
const PREF_COMMENT_ON_MY_COMMENT = 1 << 8;

/**
 * @typedef {{
 * myProposalStatusChange: boolean,
 * myProposalVoteStarted: boolean,
 * regularProposalVetted: boolean,
 * regularProposalEdited: boolean,
 * regularProposalVoteStarted: boolean,
 * adminProposalNew: boolean,
 * adminProposalVoteAuthorized: boolean,
 * commentOnMyProposal: boolean,
 * commentOnMyComment: boolean
 * }} EmailNotificationsPreferences - The user email notifications preferences.
 */

/**
 * emailNotificationsToPreferences decodes the email notifications preference code
 * into a readable object of user preferences.
 *
 * @param {number} notifications - The email notifications preference code.
 * @returns {EmailNotificationsPreferences} - The decoded email notifications
 * preference object.
 */
export function emailNotificationsToPreferences(notifications) {
  return {
    myProposalStatusChange: !!(notifications & PREF_MY_PROPOSAL_STATUS_CHANGE),
    myProposalVoteStarted: !!(notifications & PREF_MY_PROPOSAL_VOTE_STARTED),
    regularProposalVetted: !!(notifications & PREF_REGULAR_PROPOSAL_VETTED),
    regularProposalEdited: !!(notifications & PREF_REGULAR_PROPOSAL_EDITED),
    regularProposalVoteStarted: !!(
      notifications & PREF_REGULAR_PROPOSAL_VOTE_STARTED
    ),
    adminProposalNew: !!(notifications & PREF_ADMIN_PROPOSAL_NEW),
    adminProposalVoteAuthorized: !!(
      notifications & PREF_ADMIN_PROPOSAL_VOTE_AUTHORIZED
    ),
    commentOnMyProposal: !!(notifications & PREF_COMMENT_ON_MY_PROPOSAL),
    commentOnMyComment: !!(notifications & PREF_COMMENT_ON_MY_COMMENT),
  };
}

/**
 * preferencesToEmailNotifications encodes the user preferences into a code
 * that can be used to update the user's email notifications preferences.
 *
 * @param {EmailNotificationsPreferences} preferences - The user preferences.
 * @returns {number} - The encoded email notifications preference code.
 */
export function preferencesToEmailNotifications(preferences) {
  return (
    (preferences.myProposalStatusChange ? PREF_MY_PROPOSAL_STATUS_CHANGE : 0) |
    (preferences.myProposalVoteStarted ? PREF_MY_PROPOSAL_VOTE_STARTED : 0) |
    (preferences.regularProposalVetted ? PREF_REGULAR_PROPOSAL_VETTED : 0) |
    (preferences.regularProposalEdited ? PREF_REGULAR_PROPOSAL_EDITED : 0) |
    (preferences.regularProposalVoteStarted
      ? PREF_REGULAR_PROPOSAL_VOTE_STARTED
      : 0) |
    (preferences.adminProposalNew ? PREF_ADMIN_PROPOSAL_NEW : 0) |
    (preferences.adminProposalVoteAuthorized
      ? PREF_ADMIN_PROPOSAL_VOTE_AUTHORIZED
      : 0) |
    (preferences.commentOnMyProposal ? PREF_COMMENT_ON_MY_PROPOSAL : 0) |
    (preferences.commentOnMyComment ? PREF_COMMENT_ON_MY_COMMENT : 0)
  );
}
