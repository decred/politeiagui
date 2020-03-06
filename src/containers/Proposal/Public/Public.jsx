import React, { useCallback, useMemo } from "react";
import { Spinner } from "pi-ui";
import styles from "./PublicProposals.module.css";
import { tabValues, mapProposalsTokensByTab } from "./helpers";
import useProposalsBatch from "../hooks/useProposalsBatch";
import Proposal from "src/componentsv2/Proposal";
import ProposalLoader from "src/componentsv2/Proposal/ProposalLoader";
import { PublicActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/componentsv2/RecordsView";

const renderProposal = (record) => {
  return <Proposal key={record.censorshiprecord.token} proposal={record} />;
};

const tabLabels = [
  tabValues.IN_DISCUSSION,
  tabValues.VOTING,
  tabValues.APPROVED,
  tabValues.REJECTED,
  tabValues.ABANDONED
];

const PublicProposals = ({ TopBanner, PageDetails, Sidebar, Main }) => {
  const {
    isLoading,
    isLoadingTokenInventory,
    proposals,
    proposalsTokens,
    onFetchProposalsBatch
  } = useProposalsBatch();

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
              proposalsTokens && !isLoading && content
            )}
          </PublicActionsProvider>
        </Main>
      </>
    ),
    [proposalsTokens, isLoading, isLoadingTokenInventory]
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
      dropdownTabsForMobile={true}>
      {content}
    </RecordsView>
  );
};

export default PublicProposals;
