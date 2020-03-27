import React, { useCallback } from "react";
import useProposalsBatch from "../hooks/useProposalsBatch";
import Proposal from "src/components/Proposal";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { tabValues, mapProposalsTokensByTab } from "./helpers";
import { UnvettedActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/components/RecordsView";

const renderProposal = (prop) => (
  <Proposal key={prop.censorshiprecord.token} proposal={prop} />
);

const tabLabels = [tabValues.UNREVIEWED, tabValues.CENSORED];

const UnvettedProposals = ({ TopBanner, PageDetails, Main }) => {
  const {
    proposals,
    loading,
    proposalsTokens,
    isLoadingTokenInventory: loadingTokenInventory,
    onFetchProposalsBatch
  } = useProposalsBatch();

  function handleFetchRecords(tokens) {
    return onFetchProposalsBatch(tokens, false);
  }

  const getEmptyMessage = useCallback((tab) => {
    const mapTabToMessage = {
      [tabValues.UNREVIEWED]: "No proposals unreviewed",
      [tabValues.CENSORED]: "No proposals censored"
    };
    return mapTabToMessage[tab];
  }, []);

  return (
    <RecordsView
      onFetchRecords={handleFetchRecords}
      records={proposals}
      tabLabels={tabLabels}
      recordTokensByTab={mapProposalsTokensByTab(tabLabels, proposalsTokens)}
      renderRecord={renderProposal}
      displayTabCount={!loadingTokenInventory}
      placeholder={ProposalLoader}
      getEmptyMessage={getEmptyMessage}>
      {({ tabs, content }) => (
        <>
          <TopBanner>
            <PageDetails title="Unvetted Proposals">{tabs}</PageDetails>
          </TopBanner>
          <Main fillScreen>
            <UnvettedActionsProvider>
              {proposalsTokens && !loading && content}
            </UnvettedActionsProvider>
          </Main>
        </>
      )}
    </RecordsView>
  );
};

export default UnvettedProposals;
