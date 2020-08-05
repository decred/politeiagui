import React, { useCallback, useState, useMemo } from "react";
import useProposalsBatch from "src/hooks/api/useProposalsBatch";
import Proposal from "src/components/Proposal";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { tabValues, mapProposalsTokensByTab } from "./helpers";
import { getRfpLinkedProposals } from "../helpers";
import { UnvettedActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/components/RecordsView";

const renderProposal = (prop) => (
  <Proposal key={prop.censorshiprecord.token} proposal={prop} />
);

const tabLabels = [tabValues.UNREVIEWED, tabValues.CENSORED];

const UnvettedProposals = ({ TopBanner, PageDetails, Main }) => {
  const [remainingTokens, setRemainingTokens] = useState();
  const { proposals, proposalsTokens, loading, verifying } = useProposalsBatch(
    remainingTokens,
    {
      fetchRfpLinks: true,
      fetchVoteSummaries: true
    }
  );

  const records = useMemo(() => getRfpLinkedProposals(proposals), [proposals]);

  const getEmptyMessage = useCallback((tab) => {
    const mapTabToMessage = {
      [tabValues.UNREVIEWED]: "No proposals unreviewed",
      [tabValues.CENSORED]: "No proposals censored"
    };
    return mapTabToMessage[tab];
  }, []);

  return (
    <RecordsView
      records={records}
      tabLabels={tabLabels}
      recordTokensByTab={mapProposalsTokensByTab(tabLabels, proposalsTokens)}
      renderRecord={renderProposal}
      displayTabCount={!!proposalsTokens}
      placeholder={ProposalLoader}
      setRemainingTokens={setRemainingTokens}
      isLoading={loading || verifying}
      getEmptyMessage={getEmptyMessage}>
      {({ tabs, content }) => (
        <>
          <TopBanner>
            <PageDetails title="Unvetted Proposals">{tabs}</PageDetails>
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

export default UnvettedProposals;
