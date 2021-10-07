import React, { useCallback, useMemo } from "react";
import get from "lodash/fp/get";
import isEmpty from "lodash/fp/isEmpty";
import styles from "./VettedProposals.module.css";
import { tabValues, statusByTab, sortByTab } from "./helpers";
import { mapProposalsTokensByTab } from "src/containers/Proposal/helpers";
import useProposalsBatch from "src/hooks/api/useProposalsBatch";
import useLegacyVettedProposals from "src/hooks/api/useLegacyVettedProposals";
import Proposal from "src/components/Proposal";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { PublicActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/components/RecordsView";
import { LIST_HEADER_VETTED, INELIGIBLE } from "src/constants";
import useQueryStringWithIndexValue from "src/hooks/utils/useQueryStringWithIndexValue";
import usePolicy from "src/hooks/api/usePolicy";

const renderProposal = (record) => (
  <Proposal key={record.censorshiprecord.token} proposal={record} />
);

const tabLabels = [
  tabValues.UNDER_REVIEW,
  tabValues.APPROVED,
  tabValues.REJECTED,
  tabValues.INELIGIBLE
];

const VettedProposals = ({ TopBanner, PageDetails, Sidebar, Main }) => {
  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);
  const statuses = statusByTab[tabLabels[index]];
  const sort = sortByTab[tabLabels[index]];
  const policy = usePolicy();
  const proposalPageSize = get(
    ["policyTicketVote", "summariespagesize"],
    policy
  );
  const inventoryPageSize = get(
    ["policyTicketVote", "inventorypagesize"],
    policy
  );

  const {
    proposals,
    proposalsTokens,
    loading,
    verifying,
    onRestartMachine,
    hasMoreProposals,
    onFetchMoreProposals,
    isProposalsBatchComplete
  } = useProposalsBatch({
    fetchRfpLinks: true,
    fetchVoteSummaries: true,
    statuses: statuses,
    proposalPageSize: proposalPageSize,
    inventoryPageSize: inventoryPageSize,
    fetchVoteSummary: true,
    fetchProposalSummary: true
  });

  // TODO: remove legacy
  const { legacyProposals, legacyProposalsTokens } = useLegacyVettedProposals(
    isProposalsBatchComplete,
    statuses[0] // hard code because legacy proposals tab always have 1 item in statuses
  );

  const mergedProposalsTokens = !isEmpty(legacyProposalsTokens)
    ? Object.keys(proposalsTokens).reduce((acc, cur) => {
        if (cur === INELIGIBLE) {
          return {
            ...acc,
            [cur]: [
              ...proposalsTokens[cur],
              ...legacyProposalsTokens["abandoned"]
            ]
          };
        }
        return {
          ...acc,
          [cur]: [
            ...(proposalsTokens[cur] || []),
            ...(legacyProposalsTokens[cur] || [])
          ]
        };
      }, {})
    : proposalsTokens;

  const getEmptyMessage = useCallback((tab) => {
    const mapTabToMessage = {
      [tabValues.UNDER_REVIEW]: "No proposals under review",
      [tabValues.APPROVED]: "No proposals approved",
      [tabValues.REJECTED]: "No proposals rejected",
      [tabValues.INELIGIBLE]: "No proposals archived or censored"
    };
    return mapTabToMessage[tab];
  }, []);

  // TODO: remove legacy
  const recordTokensByTab = useMemo(
    () => mapProposalsTokensByTab(statusByTab, mergedProposalsTokens),
    [mergedProposalsTokens]
  );

  const content = useCallback(
    ({ tabs, content }) => (
      <>
        <TopBanner>
          <PageDetails title={LIST_HEADER_VETTED}>{tabs}</PageDetails>
        </TopBanner>
        <Sidebar />
        <Main className={styles.customMain}>
          <PublicActionsProvider>
            {proposalsTokens && content}
          </PublicActionsProvider>
        </Main>
      </>
    ),
    [proposalsTokens]
  );

  const handleSetIndex = (newIndex) => {
    onSetIndex(newIndex);
    onRestartMachine(statusByTab[tabLabels[newIndex]]);
  };

  return (
    <RecordsView
      records={{ ...proposals, ...legacyProposals }}
      tabLabels={tabLabels}
      recordTokensByTab={recordTokensByTab}
      renderRecord={renderProposal}
      displayTabCount={!!proposalsTokens}
      placeholder={ProposalLoader}
      getEmptyMessage={getEmptyMessage}
      index={index}
      onSetIndex={handleSetIndex}
      onFetchMoreProposals={onFetchMoreProposals}
      dropdownTabsForMobile
      hasMore={hasMoreProposals}
      pageSize={proposalPageSize}
      isLoading={loading || verifying}
      sort={sort}>
      {content}
    </RecordsView>
  );
};

export default VettedProposals;
