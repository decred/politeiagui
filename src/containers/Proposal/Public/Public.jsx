import React, { useCallback, useMemo, useState } from "react";
import { Spinner } from "pi-ui";
import styles from "./PublicProposals.module.css";
import { tabValues, mapProposalsTokensByTab } from "./helpers";
import useProposalsBatch from "src/hooks/api/useProposalsBatch";
import Proposal from "src/components/Proposal";
import ProposalLoader from "src/components/Proposal/ProposalLoader";
import { PublicActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/components/RecordsView";

const renderProposal = (record) => (
  <Proposal key={record.censorshiprecord.token} proposal={record} />
);

const tabLabels = [
  tabValues.IN_DISCUSSION,
  tabValues.VOTING,
  tabValues.APPROVED,
  tabValues.REJECTED,
  tabValues.ABANDONED
];

const PublicProposals = ({ TopBanner, PageDetails, Sidebar, Main }) => {
  const [remainingTokens, setRemainingTokens] = useState();

  const {
    isLoadingTokenInventory,
    proposals,
    proposalsTokens,
    onFetchProposalsBatch,
    test
  } = useProposalsBatch(remainingTokens, true);

  const getEmptyMessage = useCallback((tab) => {
    const mapTabToMessage = {
      [tabValues.IN_DISCUSSION]: "No proposals under dicussion",
      [tabValues.VOTING]: "No proposals voting",
      [tabValues.APPROVED]: "No proposals approved",
      [tabValues.REJECTED]: "No proposals rejected",
      [tabValues.ABANDONED]: "No proposals abandoned"
    };
    return mapTabToMessage[tab];
  }, []);

  const recordTokensByTab = useMemo(
    () => mapProposalsTokensByTab(tabLabels, proposalsTokens),
    [proposalsTokens]
  );

  const content = useCallback(
    ({ tabs, content }) => (
      <>
        <TopBanner>
          <PageDetails title="Public Proposals">{tabs}</PageDetails>
        </TopBanner>
        <Sidebar />
        <Main className={styles.customMain}>
          <PublicActionsProvider>
            {isLoadingTokenInventory ? (
              <div className={styles.spinnerWrapper}>
                <Spinner invert />
              </div>
            ) : (
              proposalsTokens && content
            )}
          </PublicActionsProvider>
        </Main>
      </>
    ),
    [proposalsTokens, isLoadingTokenInventory]
  );

  return (
    <RecordsView
      onFetchRecords={onFetchProposalsBatch}
      records={proposals}
      tabLabels={tabLabels}
      recordTokensByTab={recordTokensByTab}
      renderRecord={renderProposal}
      displayTabCount={!!proposalsTokens}
      placeholder={ProposalLoader}
      getEmptyMessage={getEmptyMessage}
      setRemainingTokens={setRemainingTokens}
      dropdownTabsForMobile={true}>
      {content}
    </RecordsView>
  );
};

export default PublicProposals;
