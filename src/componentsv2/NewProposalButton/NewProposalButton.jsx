import React from "react";
import { Button } from "pi-ui";
import { withRouter } from "react-router-dom";
import LoggedInContent from "../LoggedInContent";
import styles from "./NewProposalButton.module.css";

const NewProposalButton = ({ history, location }) => {
  const newProposalPath = "/proposals/new";
  const isNewProposalRoute = location.pathname === newProposalPath;
  return (
    !isNewProposalRoute && (
      <LoggedInContent>
        <Button
          type="button"
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
