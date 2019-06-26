import React, { useState, useEffect, useReducer } from "react";
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

const PublicProposals = ({
  proposals,
  proposalsTokens,
  onFetchVettedByTokens,
  onFetchTokenInventory,
  isLoading,
  error,
  pageSize
}) => {
  const [tabOption, setTabOption] = useState(getInitialTabValue());
  const [hasMoreToLoad, setHasMore] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { itemsOnLoad } = state;

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
    const numOfItemsToBeFetched = propTokensToBeFetched.length;
    dispatch({ type: INCREMENT_LOADING_ITEMS, count: numOfItemsToBeFetched });
    await onFetchVettedByTokens(propTokensToBeFetched);
    dispatch({ type: DECREMENT_LOADING_ITEMS, count: numOfItemsToBeFetched });
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
    onFetchTokenInventory();
<<<<<<< HEAD
    onFetchLastBlockHeight();
  }, [onFetchLastBlockHeight, onFetchTokenInventory]);
=======
  }, []);
>>>>>>> 6055451... Remove references to dcrdata bestblock request

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
