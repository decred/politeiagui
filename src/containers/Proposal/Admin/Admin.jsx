import React, { useCallback, useState } from "react";
import useProposalsBatch from "src/hooks/api/useProposalsBatch";
import Proposal from "src/components/Proposal";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { tabValues, mapProposalsTokensByTab } from "./helpers";
// XXX change to AdminActionsProvider
import { UnvettedActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/components/RecordsView";
import { LIST_HEADER_ADMIN } from "src/constants";

const renderProposal = (prop) => (
  <Proposal key={prop.censorshiprecord.token} proposal={prop} />
);

const tabLabels = [
  tabValues.UNREVIEWED,
  tabValues.VETTEDCENSORED,
  tabValues.UNVETTEDCENSORED
];

const AdminProposals = ({ TopBanner, PageDetails, Main }) => {
  const [remainingTokens, setRemainingTokens] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const { proposals, proposalsTokens, loading, verifying } = useProposalsBatch(
    remainingTokens,
    {
      fetchRfpLinks: true,
      fetchVoteSummaries: false,
      unvetted:
        tabLabels[tabIndex] === tabValues.UNREVIEWED ||
        tabLabels[tabIndex] === tabValues.UNVETTEDCENSORED
    }
  );

  const getEmptyMessage = useCallback((tab) => {
    const mapTabToMessage = {
      [tabValues.UNREVIEWED]: "No proposals unreviewed",
      [tabValues.VETTEDCENSORED]: "No vetted proposals censored",
      [tabValues.UNVETTEDCENSORED]: "No unvetted proposals censored"
    };
    return mapTabToMessage[tab];
  }, []);

  return (
    <RecordsView
      records={proposals}
      tabLabels={tabLabels}
      recordTokensByTab={mapProposalsTokensByTab(tabLabels, proposalsTokens)}
      renderRecord={renderProposal}
      displayTabCount={!!proposalsTokens}
      placeholder={ProposalLoader}
      setRemainingTokens={setRemainingTokens}
      onTabChange={setTabIndex}
      isLoading={loading || verifying}
      getEmptyMessage={getEmptyMessage}>
      {({ tabs, content }) => (
        <>
          <TopBanner>
            <PageDetails title={LIST_HEADER_ADMIN}>{tabs}</PageDetails>
          </TopBanner>
          <Main fillScreen>
            <UnvettedActionsProvider>
              {proposalsTokens && content}
            </UnvettedActionsProvider>
          </Main>
        </>
      )}
    </RecordsView>
  );
};

export default AdminProposals;
