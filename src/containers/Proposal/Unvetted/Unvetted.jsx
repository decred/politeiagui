import React from "react";
import { useUnvettedProposals } from "./hooks";
import Proposal from "src/componentsv2/Proposal";
import ProposalLoader from "src/componentsv2/Proposal/ProposalLoader";
import { tabValues, mapProposalsTokensByTab } from "./helpers";
import { UnvettedActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/componentsv2/RecordsView";

const renderProposal = prop => (
  <Proposal key={prop.censorshiprecord.token} proposal={prop} />
);

const UnvettedProposals = ({ TopBanner, PageDetails, Sidebar, Main }) => {
  const {
    proposals,
    loading,
    proposalsTokens,
    loadingTokenInventory,
    onFetchProposalsBatch
  } = useUnvettedProposals();
  const tabLabels = [tabValues.UNREVIEWED, tabValues.CENSORED];

  function handleFetchRecords(tokens) {
    return onFetchProposalsBatch(tokens, false);
  }

  return (
    <RecordsView
      onFetchRecords={handleFetchRecords}
      records={proposals}
      tabLabels={tabLabels}
      recordTokensByTab={mapProposalsTokensByTab(tabLabels, proposalsTokens)}
      renderRecord={renderProposal}
      displayTabCount={!loadingTokenInventory}
      placeholder={ProposalLoader}
    >
      {({ tabs, content }) => (
        <>
          <TopBanner>
            <PageDetails title="Unvetted Proposals">{tabs}</PageDetails>
          </TopBanner>
          <Sidebar />
          <Main>
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
