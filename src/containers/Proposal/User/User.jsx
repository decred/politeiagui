import React, { useMemo, useState, useCallback } from "react";
import { Select } from "pi-ui";
import Drafts from "./Drafts";
import Submitted from "./Submitted";
import styles from "./User.module.css";

const SUBMITTED = "Submitted";
const DRAFTS = "Drafts";

export const filterOptions = [
  { value: SUBMITTED, label: SUBMITTED },
  { value: DRAFTS, label: DRAFTS }
];

const ProposalsUser = ({ userID, withDrafts = false }) => {
  // Proposals fetching will be triggered from the 'proposals' tab
  // but cached here to avoid re-fetching it
  const [userProposals, setUserProposals] = useState(null);

  const [proposalsFilter, setProposalsFilter] = useState(filterOptions[0]);

  const onSetFilterOption = useCallback(
    option => {
      setProposalsFilter(option);
    },
    [setProposalsFilter]
  );

  const content = useMemo(() => {
    const mapFilterOptionsToContent = {
      [DRAFTS]: <Drafts />,
      [SUBMITTED]: (
        <Submitted
          userID={userID}
          userProposals={userProposals}
          setUserProposals={setUserProposals}
        />
      )
    };
    return mapFilterOptionsToContent[proposalsFilter.value];
  }, [userProposals, userID, proposalsFilter]);

  return (
    <>
      {withDrafts && (
        <div className={styles.selectContainer}>
          <Select
            className={styles.select}
            value={proposalsFilter}
            onChange={onSetFilterOption}
            options={filterOptions}
          />
        </div>
      )}
      {content}
    </>
  );
};

export default ProposalsUser;
