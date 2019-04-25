import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "../Tabs";
import RecordsList from "../RecordsList/RecordsList";
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

const PAGE_SIZE = 3;

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
  onFetchTokenInventory
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
    const index =
      filteredProposals.length === 0
        ? filteredProposals.length
        : filteredProposals.length - 1;
    const propTokensToBeFetched = filteredTokens.slice(
      index,
      index + PAGE_SIZE
    );
    setHasMore(false);
    setItemsOnLoad(propTokensToBeFetched.length);
    await onFetchVettedByTokens(propTokensToBeFetched);
    setHasMore(hasMoreRecordsToLoad);
    setItemsOnLoad(0);
  };

  useEffect(() => {
    setHasMore(true);
  }, [filteredTokens]);

  useEffect(() => {
    onFetchProposalsVoteStatus();
    onFetchTokenInventory();
  }, []);

  return (
    <div className="content">
      <h1 className="content-title">Public Proposals</h1>

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
      {proposalsTokens && (
        <RecordsList
          records={filteredProposals}
          recordsTokens={filteredTokens}
          renderRecord={renderProposal}
          onFetchRecords={handleFetchMoreRecords}
          hasMore={hasMoreToLoad}
          isLoading={itemsOnLoad > 0}
          loadingPlaceholder={getListLoadingPlaceholders(itemsOnLoad)}
        />
      )}
    </div>
  );
};

export default proposalsConnector(PublicProposals);
