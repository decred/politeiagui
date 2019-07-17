import { Button } from "pi-ui";
import React from "react";
import { withRouter } from "react-router-dom";
import { PAYWALL_STATUS_PAID } from "src/constants";
import usePaywall from "src/hooks/usePaywall";
import LoggedInContent from "../LoggedInContent";
import styles from "./NewProposalButton.module.css";

const NewProposalButton = ({ history, location }) => {
  const newProposalPath = "/proposals/new";
  const isNewProposalRoute = location.pathname === newProposalPath;
  const { userPaywallStatus } = usePaywall();
  const isPaid = userPaywallStatus === PAYWALL_STATUS_PAID;
  return (
    !isNewProposalRoute && (
      <LoggedInContent>
        <Button
          type="button"
          kind={isPaid ? "primary" : "disabled"}
          className={styles.newProposalButton}
          onClick={() => history.push(newProposalPath)}
        >
          <span className={styles.newProposalButtonContent} />
        </Button>
      </LoggedInContent>
    )
  );
};

export default withRouter(NewProposalButton);
