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
      <Text>
        proposal credits:{" "}
        <span data-testid="proposal-credits-number">
          {user && proposalCredits}
        </span>
      </Text>
      <img
        alt="purchase proposal credits"
        className={styles.proposalCreditsButton}
        src={plusIcon}
        onClick={pushToProposalCredits}
      />
    </div>
  );
};

export default withRouter(ProposalCreditsIndicator);
