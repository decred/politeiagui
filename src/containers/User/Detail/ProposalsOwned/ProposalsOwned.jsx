import React from "react";
import ProposalBilling from "./ProposalBilling";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import { Spinner, H3, Message } from "pi-ui";
import isEmpty from "lodash/fp/isEmpty";
import styles from "./ProposalsOwned.module.css";
import usePolicy from "src/hooks/api/usePolicy";

const ProposalsOwned = ({ proposalsOwned }) => {
  const {
    policyTicketVote: { summariespagesize: proposalPageSize }
  } = usePolicy();
  const { proposalsByToken, isLoading, error } = useApprovedProposals(
    proposalsOwned,
    proposalPageSize
  );
  const loading = (isLoading || isEmpty(proposalsByToken)) && !error;

  return loading ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : error ? (
    <Message kind="error">{error.toString()}</Message>
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
