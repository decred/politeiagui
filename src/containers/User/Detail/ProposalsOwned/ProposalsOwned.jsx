import React from "react";
import ProposalBilling from "./ProposalBilling";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import { useEffect } from "react";
import { Spinner } from "pi-ui";
import isEmpty from "lodash/fp/isEmpty";
import styles from "./ProposalsOwned.module.css";

const ProposalsOwned = ({ proposalsOwned }) => {
  const {
    proposalByToken,
    onFetchProposalsBatch,
    isLoading
  } = useApprovedProposals();

  useEffect(() => {
    onFetchProposalsBatch();
  }, [onFetchProposalsBatch]);

  return isLoading || isEmpty(proposalByToken) ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <>
      {proposalsOwned &&
        proposalsOwned.map((p) => {
          return (
            <ProposalBilling
              key={p}
              token={p}
              title={proposalByToken[p.trim()].name}
            />
          );
        })}
    </>
  );
};

export default ProposalsOwned;
