import React, { useState, useEffect } from "react";
import { useUserProposals } from "./hooks";
import Proposal from "src/components/Proposal";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import LazyList from "src/components/LazyList";
import LoadingPlaceholders from "src/components/LoadingPlaceholders";
import HelpMessage from "src/components/HelpMessage";

const PAGE_SIZE = 20;

const Proposals = (props) => {
  const {
    proposals,
    loading,
    numOfUserProposals,
    onFetchUserProposals
  } = useUserProposals(props);
  const renderProposal = (record) => {
    return <Proposal key={record.censorshiprecord.token} proposal={record} />;
  };

  const [hasMoreToLoad, setHasMore] = useState(false);

  const { userID } = props;

  const amountOfProposalsFetched = proposals ? proposals.length : 0;

  async function handleFetchMoreProposals() {
    try {
      const lastProposal =
        proposals && !!proposals.length && proposals[proposals.length - 1];
      const lastProposalToken = lastProposal
        ? lastProposal.censorshiprecord.token
        : "";
      setHasMore(false);
      await onFetchUserProposals(userID, lastProposalToken);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const numOfProposalsLoaded = proposals.length;
  const initialFetchDone = numOfProposalsLoaded === numOfUserProposals;

  useEffect(() => {
    const hasMoreRecordsToLoad =
      !initialFetchDone || numOfProposalsLoaded < numOfUserProposals;
    setHasMore(hasMoreRecordsToLoad);
  }, [numOfProposalsLoaded, numOfUserProposals, initialFetchDone]);

  const amountOfMissingProposals =
    numOfUserProposals - amountOfProposalsFetched;
  const itemsToBeLoaded =
    amountOfMissingProposals > PAGE_SIZE ? PAGE_SIZE : amountOfMissingProposals;

  return (
    <UnvettedActionsProvider>
      <PublicActionsProvider>
        <LazyList
          items={proposals || []}
          renderItem={renderProposal}
          onFetchMore={handleFetchMoreProposals}
          hasMore={hasMoreToLoad}
          isLoading={loading || !initialFetchDone}
          emptyListComponent={<HelpMessage>No proposals available</HelpMessage>}
          loadingPlaceholder={
            <LoadingPlaceholders
              placeholder={ProposalLoader}
              numberOfItems={itemsToBeLoaded || 3}
            />
          }
        />
      </PublicActionsProvider>
    </UnvettedActionsProvider>
  );
};

export default Proposals;
