import React from "react";
import { withRouter } from "react-router-dom";
import { Text, Button } from "pi-ui";
import useNavigation from "src/hooks/useNavigation";
import styles from "./ProposalCreditsIndicator.module.css";
import { usePollProposalCreditsPayment } from "src/containers/User/Detail/Credits/hooks";

const ProposalCreditsIndicator = ({ history }) => {
  const { proposalCredits, user } = useNavigation();
  usePollProposalCreditsPayment();
  const pushToProposalCredits = () =>
    history.push(`/user/${user.userid}?tab=credits`);
  return (
    <div className={styles.wrapper}>
      <Text>proposal credits: {proposalCredits}</Text>
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
