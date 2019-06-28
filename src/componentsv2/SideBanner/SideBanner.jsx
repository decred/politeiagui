import React from "react";
import { withRouter } from "react-router-dom";
import { SideBanner as UISideBanner, Button } from "pi-ui";
import LoggedInContent from "../LoggedInContent";
import styles from "./SideBanner.module.css";

const SideBanner = ({ history, location }) => {
  const newProposalPath = "/proposals/new";
  const isNewProposalRoute = location.pathname === newProposalPath;
  return (
    <UISideBanner className={styles.customSideBanner}>
      {!isNewProposalRoute && (
        <LoggedInContent>
          <Button
            type="button"
            className={styles.newProposalButton}
            onClick={() => history.push(newProposalPath)}
          >
            <span className={styles.newProposalButtonContent} />
          </Button>
        </LoggedInContent>
      )}
    </UISideBanner>
  );
};

export default withRouter(SideBanner);
