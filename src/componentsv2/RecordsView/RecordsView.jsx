import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
  useCallback
} from "react";
import { Tabs, Tab, useMediaQuery } from "pi-ui";
import difference from "lodash/difference";
import union from "lodash/union";
import LazyList from "src/componentsv2/LazyList";
import { getRecordsByTabOption, getRecordToken } from "./helpers";
import useQueryStringWithIndexValue from "src/hooks/utils/useQueryStringWithIndexValue";
import HelpMessage from "src/componentsv2/HelpMessage";
import { useConfig } from "src/containers/Config";
import { NOJS_ROUTE_PREFIX } from "src/constants";

const DEFAULT_PAGE_SIZE = 4;

const LoadingPlaceholders = ({ numberOfItems, placeholder }) => {
  const Item = placeholder;
  const placeholders = [];
  for (let i = 0; i < numberOfItems; i++) {
    placeholders.push(<Item key={`placeholder-${i}`} />);
  }
  return <>{placeholders}</>;
};

const initialState = { itemsOnLoad: 0, requestedTokens: [] };

const INCREMENT_LOADING_ITEMS = "increment";
const DECREMENT_LOADING_ITEMS = "decrement";

function reducer(state, action) {
  switch (action.type) {
    case INCREMENT_LOADING_ITEMS:
      return {
        ...state,
        itemsOnLoad: state.itemsOnLoad + action.count,
        requestedTokens: state.requestedTokens.concat(action.tokens)
      };
    case DECREMENT_LOADING_ITEMS:
      return { ...state, itemsOnLoad: state.itemsOnLoad - action.count };
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
  getEmptyMessage = getDefaultEmptyMessage,
  dropdownTabsForMobile
}) => {
  const [hasMoreToLoad, setHasMore] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { itemsOnLoad } = state;
  const { javascriptEnabled } = useConfig();

  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);
  const tabOption = tabLabels[index];

  const filteredTokens = recordTokensByTab[tabOption] || [];

  const isMobileScreen = useMediaQuery("(max-width:560px)");

  const filteredRecords = useMemo(
    () => getRecordsByTabOption(records, filteredTokens),
    [records, filteredTokens]
  );

  const handleFetchMoreRecords = useCallback(async () => {
    // make sure tokens being requested are different from the ones
    // already requested or fetched
    const fetchedTokens = filteredRecords.map(getRecordToken);
    const recordTokensToBeFetched = difference(
      filteredTokens,
      union(state.requestedTokens, fetchedTokens)
    ).slice(0, pageSize);

    setHasMore(false);
    const numOfItemsToBeFetched = recordTokensToBeFetched.length;

    // only proceed if there is at least one token to be fetched
    if (!numOfItemsToBeFetched) return;

    dispatch({
      type: INCREMENT_LOADING_ITEMS,
      count: numOfItemsToBeFetched,
      tokens: recordTokensToBeFetched
    });

    try {
      await onFetchRecords(recordTokensToBeFetched);
      dispatch({ type: DECREMENT_LOADING_ITEMS, count: numOfItemsToBeFetched });
    } catch (e) {
      dispatch({
        type: DECREMENT_LOADING_ITEMS,
        count: itemsOnLoad + numOfItemsToBeFetched
      });
    }
  }, [
    filteredRecords,
    filteredTokens,
    pageSize,
    setHasMore,
    onFetchRecords,
    itemsOnLoad,
    state.requestedTokens
  ]);

  useEffect(() => {
    const hasMoreRecordsToLoad =
      filteredTokens && filteredRecords.length < filteredTokens.length;
    setHasMore(hasMoreRecordsToLoad);
  }, [filteredTokens, filteredRecords.length]);

  const getPropsCountByTab = useCallback(
    tab => {
      if (!recordTokensByTab) return "";
      return (recordTokensByTab[tab] || []).length;
    },
    [recordTokensByTab]
  );

  const tabs = useMemo(
    () =>
      tabLabels.map(label => (
        <Tab
          key={`tab-${label}`}
          count={displayTabCount ? getPropsCountByTab(label) : ""}
          label={label}
        />
      )),
    [tabLabels, displayTabCount, getPropsCountByTab]
  );

  const nojsTabs = useMemo(
    () =>
      tabLabels.map(label => (
        <Tab
          key={`tab2-${label}`}
          count={displayTabCount ? getPropsCountByTab(label) : ""}
          label={
            <a href={`${NOJS_ROUTE_PREFIX}/?tab=${label.toLowerCase()}`}>
              {label}
            </a>
          }
        />
      )),
    [tabLabels, displayTabCount, getPropsCountByTab]
  );

  const loadingPlaceholders = useMemo(
    () => (
      <LoadingPlaceholders
        numberOfItems={itemsOnLoad}
        placeholder={placeholder}
      />
    ),
    [itemsOnLoad, placeholder]
  );

  const useDropdownTabs = isMobileScreen && dropdownTabsForMobile;

  return children({
    tabs: (
      <Tabs
        onSelectTab={onSetIndex}
        activeTabIndex={index}
        className={useDropdownTabs ? "padding-bottom-s" : ""}
        mode={useDropdownTabs ? "dropdown" : "horizontal"}
      >
        {javascriptEnabled ? tabs : nojsTabs }
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
        loadingPlaceholder={loadingPlaceholders}
      />
    )
  });
};

export default RecordsView;
