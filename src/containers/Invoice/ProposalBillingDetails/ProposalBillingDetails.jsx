import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Spinner, Card, Table, H3, Message } from "pi-ui";
import { useProposalBillingDetails } from "./hooks";
import get from "lodash/fp/get";
import Link from "src/components/Link";
import { usdFormatter, formatCentsToUSD } from "src/utils";

import styles from "./ProposalBillingDetails.module.css";

const HEADERS = [
  "User",
  "Contractor Rate",
  "Exchange Rate",
  "Total (DCR)",
  "Total (USD)",
  "Invoice"
];

const getInvoiceTotal = (rate, lineItems) => {
  const laborInMinutes = lineItems.reduce((acc, cur) => acc + cur.labor, 0);
  const laborInHours = laborInMinutes / 60;
  return laborInHours * rate; // total
};

const getDetailsData = (invoices) =>
  (invoices &&
    invoices.map(({ username, userid, censorshiprecord: { token }, input }) => {
      const totalUsd = getInvoiceTotal(input.contractorrate, input.lineitems);
      const totalDcr = totalUsd / input.exchangerate;
      return {
        User: <Link to={`/user/${userid}`}>{username}</Link>,
        "Contractor Rate": usdFormatter.format(input.contractorrate / 100),
        "Exchange Rate": usdFormatter.format(input.exchangerate / 100),
        "Total (DCR)": totalDcr.toFixed(8),
        "Total (USD)": usdFormatter.format(totalUsd / 100),
        Invoice: <Link to={`/invoices/${token}`}>{token}</Link>
      };
    })) ||
  [];

const ProposalBillingDetails = ({ TopBanner, PageDetails, Main, match }) => {
  const [error, setError] = useState();
  const tokenFromUrl = get("params.token", match);
  const {
    getSpendingDetails,
    proposalBillingDetails,
    loading
  } = useProposalBillingDetails(tokenFromUrl);

  useEffect(() => {
    getSpendingDetails(tokenFromUrl).catch((e) => setError(e));
  }, [getSpendingDetails, tokenFromUrl]);

  const isDetailsLoaded = proposalBillingDetails && !loading;

  return (
    <>
      <TopBanner>
        <PageDetails
          title={`Proposal Billing Details: ${
            isDetailsLoaded ? proposalBillingDetails.title : ""
          }`}
          subtitle={isDetailsLoaded ? proposalBillingDetails.token : ""}
          actionsContent={null}
        />
      </TopBanner>
      <Main fillScreen>
        {error ? (
          <Message kind="error">{error.toString()}</Message>
        ) : !isDetailsLoaded ? (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        ) : (
          <Card paddingSize="small">
            <Table
              data={getDetailsData(proposalBillingDetails.invoices)}
              headers={HEADERS}
            />
            <H3 className={styles.totalText}>
              Total: {formatCentsToUSD(proposalBillingDetails.totalbilled)}
            </H3>
          </Card>
        )}
      </Main>
    </>
  );
};

export default withRouter(ProposalBillingDetails);
