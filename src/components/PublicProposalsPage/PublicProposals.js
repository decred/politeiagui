import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.css";
import { Tabs, Tab } from "../Tabs";
import LazyList from "../LazyList/LazyList";
import ThingLinkProposal from "../snew/ThingLink/ThingLinkProposal";
import {
  tabValues,
  getProposalTokensByTabOption,
  getProposalsByTabOption,
  getInitialTabValue,
  setTabValueInQS
} from "./helpers";
import { proposalToT3 } from "../../lib/snew";
import proposalsConnector from "../../connectors/publicProposals";

const DEFAULT_PAGE_SIZE = 4;

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
  onFetchVettedByTokens,
  onFetchProposalsVoteStatus,
  onFetchTokenInventory,
  onFetchLastBlockHeight,
  isLoading,
  error,
  pageSize
}) => {
  const [tabOption, setTabOption] = useState(getInitialTabValue());
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
    proposalsTokens
  );

  const handleFetchMoreRecords = async () => {
    const index = filteredProposals.length;
    const propTokensToBeFetched = filteredTokens.slice(index, index + pageSize);
    setHasMore(false);
    setItemsOnLoad(propTokensToBeFetched.length);
    await onFetchVettedByTokens(propTokensToBeFetched);
    setItemsOnLoad(0);
  };

  useEffect(() => {
    setTabValueInQS(tabOption);
  }, [tabOption]);

  // Verify if there is more records to load everytime the filtered tokens
  // or the filtered proposals have changed
  useEffect(() => {
    const hasMoreRecordsToLoad =
      filteredTokens && filteredProposals.length < filteredTokens.length;
    setHasMore(hasMoreRecordsToLoad);
  }, [filteredTokens, filteredProposals.length]);

  // Component did mount effect
  useEffect(() => {
    // Fetch initial data
    onFetchProposalsVoteStatus();
    onFetchTokenInventory();
    onFetchLastBlockHeight();
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
          title="Approved"
          count={proposalsTokens ? proposalsTokens.approved.length : ""}
          selected={tabValues.APPROVED === tabOption}
          onTabChange={() => handleTabChange(tabValues.APPROVED)}
        />
        <Tab
          title="Rejected"
          count={proposalsTokens ? proposalsTokens.rejected.length : ""}
          selected={tabValues.REJECTED === tabOption}
          onTabChange={() => handleTabChange(tabValues.REJECTED)}
        />
        <Tab
          title="Abandoned"
          count={proposalsTokens ? proposalsTokens.abandoned.length : ""}
          selected={tabValues.ABANDONED === tabOption}
          onTabChange={() => handleTabChange(tabValues.ABANDONED)}
        />
      </Tabs>
      {proposalsTokens && !isLoading && (
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
  proposalsTokens: PropTypes.object,
  onFetchVettedByTokens: PropTypes.func.isRequired,
  onFetchProposalsVoteStatus: PropTypes.func.isRequired,
  onFetchTokenInventory: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool
  ]),
  pageSize: PropTypes.number
};

PublicProposals.defaultProps = {
  pageSize: DEFAULT_PAGE_SIZE
};

export default proposalsConnector(PublicProposals);
