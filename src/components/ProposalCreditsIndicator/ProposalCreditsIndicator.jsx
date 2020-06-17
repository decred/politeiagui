import { Text } from "pi-ui";
import React from "react";
import { withRouter } from "react-router-dom";
import { usePollProposalCreditsPayment } from "src/containers/User/Detail/Credits/hooks";
import { useCredits } from "src/containers/User/Detail/Credits/hooks.js";
import styles from "./ProposalCreditsIndicator.module.css";
import plusIcon from "./assets/plus.svg";

const ProposalCreditsIndicator = ({ user, history }) => {
  const userID = user && user.userid;
  const { proposalCredits } = useCredits(userID);
  usePollProposalCreditsPayment();
  const pushToProposalCredits = () =>
    history.push(`/user/${user.userid}?tab=credits`);
  return (
    <div className={styles.wrapper}>
      <Text>proposal credits: {user && proposalCredits}</Text>
      <img
        className={styles.proposalCreditsButton}
        src={plusIcon}
        onClick={pushToProposalCredits}
      />
    </div>
  );
};

export default withRouter(ProposalCreditsIndicator);
