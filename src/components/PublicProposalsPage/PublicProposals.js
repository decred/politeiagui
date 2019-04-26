import React, { useState, useEffect } from "react";
import "./styles.css";
import { Tabs, Tab } from "../Tabs";
import LazyList from "../LazyList/LazyList";
import ThingLinkProposal from "../snew/ThingLink/ThingLinkProposal";
import {
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_STATUS_ABANDONED
} from "../../constants";
import { proposalToT3 } from "../../lib/snew";
import proposalsConnector from "../../connectors/publicProposals";
import { PageLoadingIcon } from "../snew";

const PAGE_SIZE = 6;

const tabValues = {
  IN_DISCUSSSION: 0,
  VOTING: 1,
  FINISHED: 2,
  ABANDONED: 3
};

const renderProposal = (record, index) => (
  <ThingLinkProposal
    key={index}
    {...{ ...proposalToT3(record, index).data, comments: [] }}
  />
);

const getProposalTokensByTabOption = (tabOption, proposalsTokens) => {
  if (!proposalsTokens) return [];
  const { pre, active, finished, abandoned } = proposalsTokens;
  switch (tabOption) {
    case tabValues.IN_DISCUSSSION:
      return pre;
    case tabValues.VOTING:
      return active;
    case tabValues.FINISHED:
      return finished;
    case tabValues.ABANDONED:
      return abandoned;
    default:
      return [];
  }
};

const getProposalsByTabOption = (tabOption, proposals, getVoteStatus) => {
  const proposalVotingStatus = proposal =>
    getVoteStatus(proposal.censorshiprecord.token).status;
  const mapTabOptionToFilter = {
    [tabValues.IN_DISCUSSSION]: p =>
      proposalVotingStatus(p) === PROPOSAL_VOTING_NOT_AUTHORIZED ||
      proposalVotingStatus(p) === PROPOSAL_VOTING_AUTHORIZED,
    [tabValues.VOTING]: p => proposalVotingStatus(p) === PROPOSAL_VOTING_ACTIVE,
    [tabValues.FINISHED]: p =>
      proposalVotingStatus(p) === PROPOSAL_VOTING_FINISHED,
    [tabValues.ABANDONED]: p => p.status === PROPOSAL_STATUS_ABANDONED
  };
  const filter = mapTabOptionToFilter[tabOption];

  return proposals.filter(filter);
};

const PlaceHolder = () => <div className="card-placeholder" />;

const getListLoadingPlaceholders = numberOfItems => {
  const placeholders = [];
  for (let i = 0; i < numberOfItems; i++) {
    placeholders.push(<PlaceHolder key={`placeholder-${i}`} />);
  }
  return placeholders;
};

const PublicProposals = ({
  proposals,
  proposalsTokens,
  getVoteStatus,
  onFetchVettedByTokens,
  onFetchProposalsVoteStatus,
  onFetchTokenInventory,
  tokenInventoryFetched,
  isLoading,
  error
}) => {
  const [tabOption, setTabOption] = useState(tabValues.IN_DISCUSSSION);
  const [hasMoreToLoad, setHasMore] = useState(true);
  const [itemsOnLoad, setItemsOnLoad] = useState(0);

  const handleTabChange = newTabValue => setTabOption(newTabValue);
  const filteredTokens = getProposalTokensByTabOption(
    tabOption,
    proposalsTokens
  );
  const filteredProposals = getProposalsByTabOption(
    tabOption,
    proposals,
    getVoteStatus
  );

  const hasMoreRecordsToLoad =
    filteredTokens && filteredProposals.length < filteredTokens.length;

  const handleFetchMoreRecords = async () => {
    const index = filteredProposals.length;
    const propTokensToBeFetched = filteredTokens.slice(
      index,
      index + PAGE_SIZE
    );
    setHasMore(false);
    setItemsOnLoad(propTokensToBeFetched.length);
    await onFetchVettedByTokens(propTokensToBeFetched);
    setItemsOnLoad(0);
  };

  useEffect(() => {
    setHasMore(hasMoreRecordsToLoad);
  }, [filteredTokens, filteredProposals.length]);

  useEffect(() => {
    onFetchProposalsVoteStatus();
    !tokenInventoryFetched && onFetchTokenInventory();
  }, []);

  if (error) throw error;

  return (
    <>
      <Tabs>
        <Tab
          title="In Discusssion"
          count={proposalsTokens ? proposalsTokens.pre.length : ""}
          selected={tabValues.IN_DISCUSSSION === tabOption}
          onTabChange={() => handleTabChange(tabValues.IN_DISCUSSSION)}
        />
        <Tab
          title="Voting"
          count={proposalsTokens ? proposalsTokens.active.length : ""}
          selected={tabValues.VOTING === tabOption}
          onTabChange={() => handleTabChange(tabValues.VOTING)}
        />
        <Tab
          title="Finished"
          count={proposalsTokens ? proposalsTokens.finished.length : ""}
          selected={tabValues.FINISHED === tabOption}
          onTabChange={() => handleTabChange(tabValues.FINISHED)}
        />
        <Tab
          title="Abandoned"
          count={proposalsTokens ? proposalsTokens.abandoned.length : ""}
          selected={tabValues.ABANDONED === tabOption}
          onTabChange={() => handleTabChange(tabValues.ABANDONED)}
        />
      </Tabs>
      {isLoading && <PageLoadingIcon />}
      {proposalsTokens && (
        <LazyList
          items={filteredProposals}
          renderItem={renderProposal}
          onFetchMore={handleFetchMoreRecords}
          hasMore={hasMoreToLoad}
          isLoading={itemsOnLoad > 0}
          loadingPlaceholder={getListLoadingPlaceholders(itemsOnLoad)}
        />
      )}
    </>
  );
};

export default proposalsConnector(PublicProposals);
