import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Spinner, Card } from "pi-ui";
import { useProposalBillingDetails } from "./hooks";
import get from "lodash/fp/get";
import InvoiceDatasheet from "src/components/InvoiceDatasheet";
import styles from "./ProposalBillingDetails.module.css";

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
  return (
    <>
      <TopBanner>
        <PageDetails
          title={`Proposal Billing Details: ${
            proposalBillingDetails ? proposalBillingDetails.title : ""
          }`}
          subtitle={proposalBillingDetails ? proposalBillingDetails.token : ""}
          actionsContent={null}
        />
      </TopBanner>
      <Main fillScreen>
        {loading && !proposalBillingDetails && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {proposalBillingDetails && (
          <Card paddingSize="small">
            <InvoiceDatasheet
              value={proposalBillingDetails.invoices[0].input.lineitems}
              omit={["proposaltoken"]}
              readOnly
              userRate={
                proposalBillingDetails.invoices[0].input.contractorrate / 100
              }
              proposalsTokens={[]}
            />
          </Card>
        )}
      </Main>
    </>
  );
};

export default withRouter(ProposalBillingDetails);
