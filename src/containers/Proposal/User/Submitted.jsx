import React, { useState, useEffect } from "react";
import { useUserProposals } from "./hooks";
import Proposal from "src/componentsv2/Proposal";
import ProposalLoader from "src/componentsv2/Proposal/ProposalLoader";
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import LazyList from "src/componentsv2/LazyList";
import LoadingPlaceholders from "src/componentsv2/LoadingPlaceholders";
import HelpMessage from "src/componentsv2/HelpMessage";

const PAGE_SIZE = 20;

const Proposals = props => {
  const {
    proposals,
    loading,
    numOfUserProposals,
    onFetchUserProposals
  } = useUserProposals(props);
  const renderProposal = record => {
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
      throw e;
    }
  }

  const numOfProsalsLoaded = proposals.length;
  const initialFetchDone = numOfUserProposals !== undefined;

  useEffect(() => {
    const hasMoreRecordsToLoad =
      !initialFetchDone || numOfProsalsLoaded < numOfUserProposals;
    setHasMore(hasMoreRecordsToLoad);
  }, [numOfProsalsLoaded, numOfUserProposals, initialFetchDone]);

  const amountOfMissingProposals =
    numOfUserProposals - amountOfProposalsFetched;
  const itemsToBeLoaded =
    amountOfMissingProposals > PAGE_SIZE ? PAGE_SIZE : amountOfMissingProposals;

  // TODO: need a loading while user has not been fetched yet
  return (
    <UnvettedActionsProvider>
      <PublicActionsProvider>
        <LazyList
          items={proposals || []}
          renderItem={renderProposal}
          onFetchMore={handleFetchMoreProposals}
          hasMore={hasMoreToLoad}
          isLoading={loading}
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
