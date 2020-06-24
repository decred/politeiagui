import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Spinner } from "pi-ui";
import { useProposalBillingDetails } from "./hooks";
import get from "lodash/fp/get";
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
        <PageDetails title="Proposal Billing" actionsContent={null} />
      </TopBanner>
      <Main fillScreen>
        {loading && !proposalBillingDetails && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
      </Main>
    </>
  );
};

export default withRouter(ProposalBillingDetails);
