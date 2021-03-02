import React, { useCallback, useState } from "react";
import useProposalsBatch from "src/hooks/api/useProposalsBatch";
import Proposal from "src/components/Proposal";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { tabValues, mapProposalsTokensByTab, statusByTab } from "./helpers";
// XXX change to AdminActionsProvider
import {
  UnvettedActionsProvider,
  PublicActionsProvider
} from "src/containers/Proposal/Actions";
import RecordsView from "src/components/RecordsView";
import { LIST_HEADER_ADMIN } from "src/constants";

const renderProposal = (prop) => (
  <Proposal key={prop.censorshiprecord.token} proposal={prop} />
);

const tabLabels = [
  tabValues.UNREVIEWED,
  tabValues.CENSORED,
  tabValues.ARCHIVED
];

const AdminProposals = ({ TopBanner, PageDetails, Main }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const {
    proposals,
    proposalsTokens,
    loading,
    verifying,
    onRestartMachine,
    hasMoreProposals
  } = useProposalsBatch({
    fetchRfpLinks: true,
    fetchVoteSummaries: false,
    unvetted: true,
    isByRecordStatus: true,
    status: statusByTab[tabLabels[tabIndex]]
  });

  const getEmptyMessage = useCallback((tab) => {
    const mapTabToMessage = {
      [tabValues.UNREVIEWED]: "No proposals unreviewed",
      [tabValues.CENSORED]: "No proposals censored",
      [tabValues.ARCHIVED]: "No proposals archived"
    };
    return mapTabToMessage[tab];
  }, []);

  const handleSetIndex = (newIndex) => {
    setTabIndex(newIndex);
    onRestartMachine(statusByTab[tabLabels[newIndex]]);
  };

  return (
    <RecordsView
      records={proposals}
      tabLabels={tabLabels}
      recordTokensByTab={mapProposalsTokensByTab(tabLabels, proposalsTokens)}
      renderRecord={renderProposal}
      displayTabCount={!!proposalsTokens}
      placeholder={ProposalLoader}
      statusByTab={statusByTab}
      index={tabIndex}
      onSetIndex={handleSetIndex}
      onFetchMoreProposals={onRestartMachine}
      dropdownTabsForMobile={true}
      hasMore={hasMoreProposals}
      isLoading={loading || verifying}
      getEmptyMessage={getEmptyMessage}>
      {({ tabs, content }) => (
        <>
          <TopBanner>
            <PageDetails title={LIST_HEADER_ADMIN}>{tabs}</PageDetails>
          </TopBanner>
          <Main fillScreen>
            <PublicActionsProvider>
              <UnvettedActionsProvider>
                {proposalsTokens && content}
              </UnvettedActionsProvider>
            </PublicActionsProvider>
          </Main>
        </>
      )}
    </RecordsView>
  );
};

export default AdminProposals;
