import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Tabs, Tab, useMediaQuery } from "pi-ui";
import difference from "lodash/difference";
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

const getFilteredRecordsAndToken = (records, tokens, tab) => {
  const filteredTokens = tokens[tab];
  const filteredRecords =
    (records &&
      filteredTokens &&
      getRecordsByTabOption(records, filteredTokens)) ||
    [];
  return [filteredRecords, filteredTokens];
};

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
  setTabIndex,
  isLoading
}) => {
  const [hasMoreToLoad, setHasMore] = useState(true);
  const [loadingItems, setLoadingItems] = useState(0);
  const { javascriptEnabled } = useConfig();

  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);
  useEffect(
    function onTabIndexChange() {
      setTabIndex && setTabIndex(index);
    },
    [index, setTabIndex]
  );
  const tabOption = tabLabels[index];
  const isMobileScreen = useMediaQuery("(max-width:560px)");

  const [filteredRecords, filteredTokens] = useMemo(
    () => getFilteredRecordsAndToken(records, recordTokensByTab, tabOption),
    [recordTokensByTab, records, tabOption]
  );

  const hasMoreRecordsToLoad =
    filteredTokens && filteredRecords.length < filteredTokens.length;

  const handleFetchMoreRecords = () => {
    if (!filteredTokens || isLoading) {
      return;
    }
    // make sure tokens being requested are different from the ones
    // already requested or fetched
    const fetchedTokens = filteredRecords.map(getRecordToken);
    const recordTokensToBeFetched = difference(
      filteredTokens,
      fetchedTokens
    ).slice(0, pageSize); // handle pagination

    setRemainingTokens(recordTokensToBeFetched);
    setHasMore(hasMoreRecordsToLoad);
    setLoadingItems(recordTokensToBeFetched.length);
  };

  useEffect(
    function setHasMoreOnTabChange() {
      setHasMore(true);
    },
    [index]
  );

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
        numberOfItems={loadingItems}
        placeholder={placeholder}
      />
    ),
    [loadingItems, placeholder]
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
