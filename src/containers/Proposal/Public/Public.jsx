import React from "react";
import styles from "./PublicProposals.module.css";
import { tabValues, mapProposalsTokensByTab } from "./helpers";
import { usePublicProposals } from "./hooks";
import Proposal from "src/componentsv2/Proposal";
import ProposalLoader from "src/componentsv2/Proposal/ProposalLoader";
import { PublicActionsProvider } from "src/containers/Proposal/Actions";
import RecordsView from "src/componentsv2/RecordsView";

const renderProposal = record => {
  return <Proposal key={record.censorshiprecord.token} proposal={record} />;
};

const PublicProposals = ({ TopBanner, PageDetails, Sidebar, Main }) => {
  const tabLabels = [
    tabValues.IN_DISCUSSSION,
    tabValues.VOTING,
    tabValues.APPROVED,
    tabValues.REJECTED,
    tabValues.ABANDONED
  ];

  const {
    isLoading,
    proposals,
    proposalsTokens,
    loadingTokenInventory,
    onFetchProposalsBatch
  } = usePublicProposals();


  return (
    <RecordsView
      onFetchRecords={onFetchProposalsBatch}
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
            <PageDetails title="Public Proposals">{tabs}</PageDetails>
          </TopBanner>
          <Sidebar />
          <Main className={styles.customMain}>
            <PublicActionsProvider>
              {proposalsTokens && !isLoading && content}
            </PublicActionsProvider>
          </Main>
        </>
      )}
    </RecordsView>
  );
};

export default PublicProposals;
