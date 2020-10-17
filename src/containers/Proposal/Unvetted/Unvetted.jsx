import React, { useCallback, useState } from "react";
import useProposalsBatch from "src/hooks/api/useProposalsBatch";
import Proposal from "src/components/Proposal";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { tabValues, mapProposalsTokensByTab } from "./helpers";
import { getRfpLinkedProposals } from "../helpers";
import { UnvettedActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/components/RecordsView";
import { getQueryStringValues } from "src/lib/queryString";

const renderProposal = (prop) => (
  <Proposal key={prop.censorshiprecord.token} proposal={prop} />
);

const tabLabels = [tabValues.UNREVIEWED, tabValues.CENSORED];

const UnvettedProposals = ({ TopBanner, PageDetails, Main }) => {
  // Ready tab name from url's query params
  // to determine proposals list state
  const { tab } = getQueryStringValues();
  console.log({ tab });
  const [remainingTokens, setRemainingTokens] = useState();
  const { proposals, proposalsTokens, loading, verifying } = useProposalsBatch(
    remainingTokens,
    {
      fetchRfpLinks: true,
      fetchVoteSummaries: false,
      unvetted: true
    }
  );

  const getEmptyMessage = useCallback((tab) => {
    const mapTabToMessage = {
      [tabValues.UNREVIEWED]: "No proposals unreviewed",
      [tabValues.CENSORED]: "No proposals censored"
    };
    return mapTabToMessage[tab];
  }, []);

  return (
    <RecordsView
      records={getRfpLinkedProposals(proposals)}
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
