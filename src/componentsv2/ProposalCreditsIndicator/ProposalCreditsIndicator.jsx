import { Button, Text } from "pi-ui";
import React from "react";
import { withRouter } from "react-router-dom";
import { usePollProposalCreditsPayment } from "src/containers/User/Detail/Credits/hooks";
import useNavigation from "src/hooks/useNavigation";
import styles from "./ProposalCreditsIndicator.module.css";

const ProposalCreditsIndicator = ({ history }) => {
  const { user } = useNavigation();
  usePollProposalCreditsPayment();
  const pushToProposalCredits = () =>
    history.push(`/user/${user.userid}?tab=credits`);
  return (
    <div className={styles.wrapper}>
      <Text>proposal credits: {user && user.proposalcredits}</Text>
      <Button
        className={styles.proposalCreditsButton}
        size="sm"
        kind="primary"
        onClick={pushToProposalCredits}
      >
        +
      </Button>
    </div>
  );
};

export default withRouter(ProposalCreditsIndicator);
