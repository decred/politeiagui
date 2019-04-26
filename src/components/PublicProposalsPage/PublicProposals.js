import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.css";
import { Tabs, Tab } from "../Tabs";
import LazyList from "../LazyList/LazyList";
import ThingLinkProposal from "../snew/ThingLink/ThingLinkProposal";
import {
  tabValues,
  getProposalTokensByTabOption,
  getProposalsByTabOption
} from "./helpers";
import { proposalToT3 } from "../../lib/snew";
import proposalsConnector from "../../connectors/publicProposals";
import { PageLoadingIcon } from "../snew";

const DEFAULT_PAGE_SIZE = 6;

const renderProposal = (record, index) => (
  <ThingLinkProposal
    key={index}
    {...{ ...proposalToT3(record, index).data, comments: [] }}
  />
);

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
  isLoading,
  error,
  pageSize
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
    const propTokensToBeFetched = filteredTokens.slice(index, index + pageSize);
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
    onFetchTokenInventory();
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

PublicProposals.propTypes = {
  proposals: PropTypes.array,
  proposalsTokens: PropTypes.array,
  getVoteStatus: PropTypes.func,
  onFetchVettedByTokens: PropTypes.func.isRequired,
  onFetchProposalsVoteStatus: PropTypes.func.isRequired,
  onFetchTokenInventory: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  pageSize: PropTypes.number
};

PublicProposals.defaultProps = {
  pageSize: DEFAULT_PAGE_SIZE
};

export default proposalsConnector(PublicProposals);
