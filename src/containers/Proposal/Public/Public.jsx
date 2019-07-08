import React, { useState, useEffect, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./PublicProposals.module.css";
import LazyList from "src/components/LazyList/LazyList";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  tabValues,
  getProposalTokensByTabOption,
  getProposalsByTabOption
} from "./helpers";
import { usePublicProposals } from "./hooks";
import useQueryStringWithIndexValue from "src/hooks/useQueryStringWithIndexValue";
import Proposal from "src/componentsv2/Proposal";

const DEFAULT_PAGE_SIZE = 4;

const renderProposal = record => {
  return <Proposal key={record.censorshiprecord.token} proposal={record} />;
};

const PlaceHolder = () => <div className={styles.cardPlaceholder} />;

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
  TopBanner,
  PageDetails,
  Sidebar,
  Main,
  Title,
  Tabs,
  Tab,
  ...props
}) => {
  const [hasMoreToLoad, setHasMore] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { itemsOnLoad } = state;
  const tabLabels = [
    tabValues.IN_DISCUSSSION,
    tabValues.VOTING,
    tabValues.APPROVED,
    tabValues.REJECTED,
    tabValues.ABANDONED
  ];

  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);
  const tabOption = tabLabels[index];

  const { pageSize = DEFAULT_PAGE_SIZE } = props;
  const {
    isLoading,
    proposals,
    proposalsTokens,
    onFetchVettedByTokens
  } = usePublicProposals(props);

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
    const hasMoreRecordsToLoad =
      filteredTokens && filteredProposals.length < filteredTokens.length;
    setHasMore(hasMoreRecordsToLoad);
  }, [filteredTokens, filteredProposals.length]);

  const getPropsCountByTab = tab => {
    if (!proposalsTokens) return "";
    const tokens = getProposalTokensByTabOption(tab, proposalsTokens);
    return tokens.length;
  };

  const placeholders = useMemo(() => getListLoadingPlaceholders(itemsOnLoad), [
    itemsOnLoad
  ]);

  return (
    <>
      <TopBanner>
        <PageDetails title="Public Proposals">
          <Tabs onSelectTab={onSetIndex} activeTabIndex={index}>
            {tabLabels.map(label => (
              <Tab
                key={`tab-${label}`}
                count={getPropsCountByTab(label)}
                label={label}
              />
            ))}
          </Tabs>
        </PageDetails>
      </TopBanner>
      <Sidebar />

      <Main className={styles.customMain}>
        {proposalsTokens && !isLoading && (
          <TransitionGroup>
            <CSSTransition key={index} classNames="fade" timeout={200}>
              <LazyList
                items={filteredProposals}
                renderItem={renderProposal}
                onFetchMore={handleFetchMoreRecords}
                hasMore={hasMoreToLoad}
                isLoading={itemsOnLoad > 0}
                loadingPlaceholder={placeholders}
              />
            </CSSTransition>
          </TransitionGroup>
        )}
      </Main>
    </>
  );
};

PublicProposals.propTypes = {
  pageSize: PropTypes.number
};

PublicProposals.defaultProps = {
  pageSize: DEFAULT_PAGE_SIZE
};

export default PublicProposals;
