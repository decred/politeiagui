import React, { useCallback } from "react";
import useProposalsBatch from "src/hooks/api/useProposalsBatch";
import Proposal from "src/components/Proposal";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import useQueryStringWithIndexValue from "src/hooks/utils/useQueryStringWithIndexValue";
import useProposalsStatusChangeUser from "src/hooks/api/useProposalsStatusChangeUser";
import { PROPOSAL_STATUS_CENSORED } from "src/constants";
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

const tabLabels = [tabValues.UNREVIEWED, tabValues.CENSORED];

const AdminProposals = ({ TopBanner, PageDetails, Main }) => {
  const [tabIndex, setTabIndex] = useQueryStringWithIndexValue(
    "tab",
    0,
    tabLabels
  );
  const {
    proposals: batchProposals,
    proposalsTokens,
    loading,
    verifying,
    onRestartMachine,
    hasMoreProposals,
    onFetchMoreProposals
  } = useProposalsBatch({
    fetchRfpLinks: true,
    fetchVoteSummaries: false,
    unvetted: true,
    proposalStatus: statusByTab[tabLabels[tabIndex]]
  });

  const { proposals, loading: mdLoading } = useProposalsStatusChangeUser(
    batchProposals,
    PROPOSAL_STATUS_CENSORED
  );

  const getEmptyMessage = useCallback((tab) => {
    const mapTabToMessage = {
      [tabValues.UNREVIEWED]: "No proposals unreviewed",
      [tabValues.CENSORED]: "No proposals censored"
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
      index={tabIndex}
      onSetIndex={handleSetIndex}
      onFetchMoreProposals={onFetchMoreProposals}
      dropdownTabsForMobile={true}
      hasMore={hasMoreProposals}
      isLoading={loading || verifying || mdLoading}
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
