import React, { useState, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import "./styles.css";
import { Tabs, Tab } from "src/components/Tabs";
import LazyList from "src/components/LazyList/LazyList";
import ThingLinkProposal from "src/components/snew/ThingLink/ThingLinkProposal";
import { proposalToT3 } from "src/lib/snew";
import {
  tabValues,
  getProposalTokensByTabOption,
  getProposalsByTabOption,
  getInitialTabValue,
  setTabValueInQS
} from "./helpers";
import { usePublicProposals } from "./hooks";

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

const initialState = { itemsOnLoad: 0 };

const INCREMENT_LOADING_ITEMS = "increment";
const DECREMENT_LOADING_ITEMS = "decrement";

function reducer(state, action) {
  switch (action.type) {
    case INCREMENT_LOADING_ITEMS:
      return { itemsOnLoad: state.itemsOnLoad + action.count };
    case DECREMENT_LOADING_ITEMS:
      return { itemsOnLoad: state.itemsOnLoad - action.count };
    default:
      throw new Error();
  }
}

export const PublicProposals = props => {
  const { pageSize = DEFAULT_PAGE_SIZE } = props;
  const {
    isLoading,
    proposals,
    proposalsTokens,
    onFetchVettedByTokens
  } = usePublicProposals(props);

  const [tabOption, setTabOption] = useState(getInitialTabValue());
  const handleTabChange = newTabValue => setTabOption(newTabValue);
  const [hasMoreToLoad, setHasMore] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { itemsOnLoad } = state;

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
    const numOfItemsToBeFetched = propTokensToBeFetched.length;
    dispatch({ type: INCREMENT_LOADING_ITEMS, count: numOfItemsToBeFetched });
    await onFetchVettedByTokens(propTokensToBeFetched);
    dispatch({ type: DECREMENT_LOADING_ITEMS, count: numOfItemsToBeFetched });
  };

  useEffect(() => {
    setTabValueInQS(tabOption);
  }, [tabOption]);

  useEffect(() => {
    const hasMoreRecordsToLoad =
      filteredTokens && filteredProposals.length < filteredTokens.length;
    setHasMore(hasMoreRecordsToLoad);
  }, [filteredTokens, filteredProposals.length]);

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
  pageSize: PropTypes.number
};

PublicProposals.defaultProps = {
  pageSize: DEFAULT_PAGE_SIZE
};
