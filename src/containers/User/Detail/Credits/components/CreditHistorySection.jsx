import React from "react";
import {
  getCsvData,
  getTableContentFromPurchases,
  tableHeaders
} from "../helpers.js";
import { PAYWALL_STATUS_PAID } from "src/constants";
import usePaywall from "src/hooks/api/usePaywall";
import { useCredits } from "../hooks.js";
import { Table, Text, Link, useMediaQuery } from "pi-ui";
import ExportToCsv from "src/components/ExportToCsv.jsx";
import usePolicy from "../../../../../hooks/api/usePolicy";

export default ({ proposalCreditPrice, user }) => {
  const userID = user && user.userid;
  const {
    proposalCreditsPurchases,
    proposalPaywallPaymentConfirmations,
    proposalPaywallPaymentTxid,
    proposalPaywallPaymentAmount
  } = useCredits(userID);
  const { paywallTxNotBefore, paywallAmount, paywallTxId, userPaywallStatus } =
    usePaywall(userID);
  const paywallPayment = {
    datePurchased: paywallTxNotBefore,
    numberPurchased: 1,
    price: paywallAmount,
    txId: paywallTxId,
    type: "fee"
  };
  const allPurchases =
    PAYWALL_STATUS_PAID === userPaywallStatus
      ? [...proposalCreditsPurchases, paywallPayment]
      : proposalCreditsPurchases;
  const policy = usePolicy();
  const data = getTableContentFromPurchases(
    allPurchases,
    {
      confirmations: proposalPaywallPaymentConfirmations,
      minRequiredConfirmations: policy.policy.minconfirmationsrequired,
      txID: proposalPaywallPaymentTxid,
      amount: proposalPaywallPaymentAmount
    },
    proposalCreditPrice
  );
  const extraSmall = useMediaQuery("(max-width: 560px)");

  return data && !!data.length ? (
    <div
      className="margin-top-l"
      style={!extraSmall ? { overflowX: "scroll" } : {}}>
      <Text className="margin-right-xs">Credit History</Text>
      <ExportToCsv
        data={getCsvData(allPurchases)}
        fields={["numberPurchased", "price", "txId", "datePurchased", "type"]}
        filename="payment_history">
        <Link style={{ cursor: "pointer" }}>Export to csv</Link>
      </ExportToCsv>
      <div className="margin-top-s">
        <Table data={data} headers={tableHeaders} />
      </div>
    </div>
  ) : null;
};
