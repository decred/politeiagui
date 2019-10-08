import React, { useCallback } from "react";
import { useUnvettedProposals } from "./hooks";
import Proposal from "src/componentsv2/Proposal";
import ProposalLoader from "src/componentsv2/Proposal/ProposalLoader";
import { tabValues, mapProposalsTokensByTab } from "./helpers";
import { UnvettedActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/componentsv2/RecordsView";

const renderProposal = prop => (
  <Proposal key={prop.censorshiprecord.token} proposal={prop} />
);

const tabLabels = [tabValues.UNREVIEWED, tabValues.CENSORED];

const UnvettedProposals = ({ TopBanner, PageDetails, Main }) => {
  const {
    proposals,
    loading,
    proposalsTokens,
    loadingTokenInventory,
    onFetchProposalsBatch
  } = useUnvettedProposals();

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
      getEmptyMessage={getEmptyMessage}
    >
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
