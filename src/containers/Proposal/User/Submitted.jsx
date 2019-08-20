import React, { useState, useEffect } from "react";
import { useUserProposals } from "./hooks";
import Proposal from "src/componentsv2/Proposal";
import ProposalLoader from "src/componentsv2/Proposal/ProposalLoader";
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import LazyList from "src/components/LazyList";
import LoadingPlaceholders from "src/componentsv2/LoadingPlaceholders";

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
    // only fetch more after the first batch of proposals has been fetched
    if (!proposals || !amountOfProposalsFetched || loading) return;
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

  useEffect(() => {
    const hasMoreRecordsToLoad =
      proposals && proposals.length < numOfUserProposals;
    setHasMore(hasMoreRecordsToLoad);
  }, [proposals, numOfUserProposals]);

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
          loadingPlaceholder={
            <LoadingPlaceholders
              placeholder={ProposalLoader}
              numberOfItems={itemsToBeLoaded || 3}
            />
          }
        />
        {/* {proposals.map(proposal => renderProposal(proposal))} */}
      </PublicActionsProvider>
    </UnvettedActionsProvider>
  );
};

export default Proposals;
