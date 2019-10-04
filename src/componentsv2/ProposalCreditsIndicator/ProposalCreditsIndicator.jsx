import { Button, Text } from "pi-ui";
import React from "react";
import { withRouter } from "react-router-dom";
import { usePollProposalCreditsPayment } from "src/containers/User/Detail/Credits/hooks";
import useNavigation from "src/hooks/api/useNavigation";
import { useCredits } from "src/containers/User/Detail/Credits/hooks.js";
import styles from "./ProposalCreditsIndicator.module.css";

const ProposalCreditsIndicator = ({ history }) => {
  const { user } = useNavigation();
  const { proposalCredits } = useCredits({ userid: user.userid });
  usePollProposalCreditsPayment();
  const pushToProposalCredits = () =>
    history.push(`/user/${user.userid}?tab=credits`);
  return (
    <div className={styles.wrapper}>
      <Text>proposal credits: {user && proposalCredits}</Text>
      <Button
        className={styles.proposalCreditsButton}
        size="sm"
        kind="primary"
        onClick={pushToProposalCredits}
      >
        <span>+</span>
      </Button>
    </div>
  );
};

export default withRouter(ProposalCreditsIndicator);
