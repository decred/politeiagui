import React, { useState, useEffect, useReducer } from "react";
import { Tabs, Tab } from "pi-ui";
import LazyList from "src/componentsv2/LazyList";
import { getRecordsByTabOption } from "./helpers";
import useQueryStringWithIndexValue from "src/hooks/utils/useQueryStringWithIndexValue";
import HelpMessage from "src/componentsv2/HelpMessage";

const DEFAULT_PAGE_SIZE = 4;

const LoadingPlaceholders = ({ numberOfItems, placeholder }) => {
  const Item = placeholder;
  const placeholders = [];
  for (let i = 0; i < numberOfItems; i++) {
    placeholders.push(<Item key={`placeholder-${i}`} />);
  }
  return <>{placeholders}</>;
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

const getDefaultEmptyMessage = () => "No records available";

const RecordsView = ({
  children,
  onFetchRecords,
  records,
  tabLabels,
  recordTokensByTab,
  renderRecord,
  displayTabCount,
  pageSize = DEFAULT_PAGE_SIZE,
  placeholder,
  getEmptyMessage = getDefaultEmptyMessage
}) => {
  const [hasMoreToLoad, setHasMore] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { itemsOnLoad } = state;

  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);
  const tabOption = tabLabels[index];

  const filteredTokens = recordTokensByTab[tabOption] || [];

  const filteredRecords = getRecordsByTabOption(
    tabOption,
    records,
    filteredTokens
  );

  const handleFetchMoreRecords = async () => {
    const index = filteredRecords.length;
    const recordTokensToBeFetched = filteredTokens.slice(
      index,
      index + pageSize
    );
    setHasMore(false);
    const numOfItemsToBeFetched = recordTokensToBeFetched.length;
    dispatch({ type: INCREMENT_LOADING_ITEMS, count: numOfItemsToBeFetched });
    try {
      await onFetchRecords(recordTokensToBeFetched);
      dispatch({ type: DECREMENT_LOADING_ITEMS, count: numOfItemsToBeFetched });
    } catch (e) {
      dispatch({
        type: DECREMENT_LOADING_ITEMS,
        count: itemsOnLoad + numOfItemsToBeFetched
      });
    }
  };

  useEffect(() => {
    const hasMoreRecordsToLoad =
      filteredTokens && filteredRecords.length < filteredTokens.length;
    setHasMore(hasMoreRecordsToLoad);
  }, [filteredTokens, filteredRecords.length]);

  const getPropsCountByTab = tab => {
    if (!recordTokensByTab) return "";
    return (recordTokensByTab[tab] || []).length;
  };

  return children({
    tabs: (
      <Tabs onSelectTab={onSetIndex} activeTabIndex={index}>
        {tabLabels.map(label => (
          <Tab
            key={`tab-${label}`}
            count={displayTabCount ? getPropsCountByTab(label) : ""}
            label={label}
          />
        ))}
      </Tabs>
    ),
    content: (
      <LazyList
        items={filteredRecords}
        renderItem={renderRecord}
        onFetchMore={handleFetchMoreRecords}
        hasMore={hasMoreToLoad}
        emptyListComponent={
          <HelpMessage>{getEmptyMessage(tabOption)}</HelpMessage>
        }
        isLoading={itemsOnLoad > 0}
        loadingPlaceholder={
          <LoadingPlaceholders
            numberOfItems={itemsOnLoad}
            placeholder={placeholder}
          />
        }
      />
    )
  });
};

export default RecordsView;
