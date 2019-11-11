import React from "react";
import { getCsvData, getTableContentFromPurchases, tableHeaders } from "../helpers.js";
import { useManageUser } from "../../hooks.js";
import { useCredits } from "../hooks.js";
import { Table, Text, Link, useMediaQuery } from "pi-ui";
import ExportToCsv from "src/componentsv2/ExportToCsv.jsx";

export default ({ proposalCreditPrice }) => {
  const { user } = useManageUser();
  const {
    proposalCreditsPurchases,
    proposalPaywallPaymentConfirmations,
    proposalPaywallPaymentTxid,
    proposalPaywallPaymentAmount
  } = useCredits({ userid: user.userid });
  const data = getTableContentFromPurchases(
    proposalCreditsPurchases,
    {
      confirmations: proposalPaywallPaymentConfirmations,
      txID: proposalPaywallPaymentTxid,
      amount: proposalPaywallPaymentAmount
    },
    proposalCreditPrice
  );

  const extraSmall = useMediaQuery("(max-width: 560px)");

  return data && !!data.length ? (
    <div
      className="margin-top-l"
      style={!extraSmall ? { overflowX: "scroll" } : {}}
    >
      <Text className="margin-right-xs">Credit History</Text>
      <ExportToCsv
        data={getCsvData(proposalCreditsPurchases)}
        fields={[
          "numberPurchased",
          "price",
          "txId",
          "datePurchased",
          "type"
        ]}
        filename="payment_history"
      >
        <Link style={{ cursor: "pointer" }}>Export to csv</Link>
      </ExportToCsv>
      <div className="margin-top-s">
        <Table data={data} headers={tableHeaders} />
      </div>
    </div>
  ) : null;
};
