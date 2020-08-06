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
import LazyList from "src/components/LazyList";
import { getRecordsByTabOption, getRecordToken } from "./helpers";
import useQueryStringWithIndexValue from "src/hooks/utils/useQueryStringWithIndexValue";
import HelpMessage from "src/components/HelpMessage";
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

const SET_LOADING_ITEMS = "set";
const RESET_LOADING_ITEMS = "reset";

function reducer(state, action) {
  switch (action.type) {
    case SET_LOADING_ITEMS:
      return {
        ...state,
        itemsOnLoad: action.count,
        requestedTokens: state.requestedTokens.concat(action.tokens)
      };
    case RESET_LOADING_ITEMS:
      return { ...state, itemsOnLoad: 0 };
    default:
      throw new Error();
  }
}

const getDefaultEmptyMessage = () => "No records available";

const RecordsView = ({
  children,
  records,
  tabLabels,
  recordTokensByTab,
  renderRecord,
  displayTabCount,
  pageSize = DEFAULT_PAGE_SIZE,
  placeholder,
  getEmptyMessage = getDefaultEmptyMessage,
  dropdownTabsForMobile,
  setRemainingTokens,
  isLoading
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

  const handleFetchMoreRecords = useCallback(() => {
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
    if (!numOfItemsToBeFetched) {
      dispatch({ type: RESET_LOADING_ITEMS });
      return;
    }

    dispatch({
      type: SET_LOADING_ITEMS,
      count: numOfItemsToBeFetched,
      tokens: recordTokensToBeFetched
    });
    setRemainingTokens(recordTokensToBeFetched);
  }, [
    filteredRecords,
    filteredTokens,
    pageSize,
    setHasMore,
    state.requestedTokens,
    setRemainingTokens
  ]);

  useEffect(() => {
    const hasMoreRecordsToLoad =
      filteredTokens && filteredRecords.length < filteredTokens.length;
    setHasMore(hasMoreRecordsToLoad);
    if (!hasMoreRecordsToLoad) {
      setRemainingTokens && setRemainingTokens();
      dispatch({ type: RESET_LOADING_ITEMS });
    }
  }, [filteredTokens, filteredRecords.length, setRemainingTokens]);

  const getPropsCountByTab = useCallback(
    (tab) => {
      if (!recordTokensByTab) return "";
      return (recordTokensByTab[tab] || []).length;
    },
    [recordTokensByTab]
  );

  const tabs = useMemo(
    () =>
      tabLabels.map((label) => (
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
      tabLabels.map((label) => (
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
        mode={useDropdownTabs ? "dropdown" : "horizontal"}>
        {javascriptEnabled ? tabs : nojsTabs}
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
        isLoading={isLoading}
        loadingPlaceholder={loadingPlaceholders}
      />
    )
  });
};

export default RecordsView;
