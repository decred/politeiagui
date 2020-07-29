import React from "react";
import ProposalBilling from "./ProposalBilling";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import { Spinner, H3 } from "pi-ui";
import isEmpty from "lodash/fp/isEmpty";
import styles from "./ProposalsOwned.module.css";

const ProposalsOwned = ({ proposalsOwned }) => {
  const { proposalsByToken, isLoading } = useApprovedProposals();

  console.log(proposalsOwned, proposalsByToken);

  return isLoading || isEmpty(proposalsByToken) ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <>
      {proposalsOwned ? (
        proposalsOwned.map((p) => {
          return (
            <ProposalBilling
              key={p}
              token={p}
              title={proposalsByToken[p.trim()].name}
            />
          );
        })
      ) : (
        <H3>No proposals owned</H3>
      )}
    </>
  );
};

export default ProposalsOwned;
