import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Spinner, Card, Table, H3 } from "pi-ui";
import { useProposalBillingDetails } from "./hooks";
import get from "lodash/fp/get";
import Link from "src/components/Link";
import { usdFormatter } from "src/utils";

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

const getDetailsData = (invoices) => {
  const formattedData =
    invoices &&
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
    });
  return formattedData || [];
};

const ProposalBillingDetails = ({ TopBanner, PageDetails, Main, match }) => {
  const tokenFromUrl = get("params.token", match);
  const {
    getSpendingDetails,
    proposalBillingDetails,
    loading
  } = useProposalBillingDetails(tokenFromUrl);

  useEffect(() => {
    getSpendingDetails(tokenFromUrl);
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
        {!isDetailsLoaded ? (
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
              Total:{" "}
              {usdFormatter.format(proposalBillingDetails.totalbilled / 100)}
            </H3>
          </Card>
        )}
      </Main>
    </>
  );
};

export default withRouter(ProposalBillingDetails);
