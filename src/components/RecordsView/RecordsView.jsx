import React, { useState, useMemo, useEffect } from "react";
import { Tabs, Tab } from "pi-ui";
import LazyList from "src/components/LazyList";
import orderBy from "lodash/fp/orderBy";
import { getRecordsByTabOption } from "./helpers";
import HelpMessage from "src/components/HelpMessage";
import { useConfig } from "src/containers/Config";
import { shortRecordToken } from "src/helpers";
import {
  NOJS_ROUTE_PREFIX,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_PAGE_SIZE
} from "src/constants";

const LoadingPlaceholders = ({ numberOfItems, placeholder }) => {
  const Item = placeholder;
  const placeholders = [];
  for (let i = 0; i < numberOfItems; i++) {
    placeholders.push(<Item key={`placeholder-${i}`} />);
  }
  return <>{placeholders}</>;
};

const getFilteredRecordsAndToken = (records, tokens, tab, filterCensored) => {
  const filteredTokens = tokens[tab].map((token) => shortRecordToken(token));
  const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);
  let filteredRecords =
    (records &&
      filteredTokens &&
      getRecordsByTabOption(records, filteredTokens)) ||
    [];
  if (filterCensored) {
    filteredRecords = filteredRecords.filter(
      ({ status }) => status !== PROPOSAL_STATUS_CENSORED
    );
  }
  return [sortByNewestFirst(filteredRecords), filteredTokens];
};

const getDefaultEmptyMessage = () => "No records available";

const RecordsView = ({
  children,
  records,
  tabLabels,
  recordTokensByTab,
  renderRecord,
  placeholder,
  getEmptyMessage = getDefaultEmptyMessage,
  onFetchMoreProposals,
  onTabChange,
  isLoading,
  index,
  onSetIndex,
  hasMore,
  filterCensored,
  pageSize = PROPOSAL_PAGE_SIZE
}) => {
  const [loadingItems, setLoadingItems] = useState(pageSize);
  const { javascriptEnabled } = useConfig();

  useEffect(
    function onTabIndexChange() {
      onTabChange && onTabChange(index);
    },
    [index, onTabChange]
  );
  const tabOption = tabLabels[index];
  const [filteredRecords, filteredTokens] = useMemo(
    () =>
      getFilteredRecordsAndToken(
        records,
        recordTokensByTab,
        tabOption,
        filterCensored
      ),
    [recordTokensByTab, records, tabOption, filterCensored]
  );

  const handleFetchMoreRecords = () => {
    if (!filteredTokens || isLoading) return;
    onFetchMoreProposals && onFetchMoreProposals();
    setLoadingItems(pageSize);
  };

  const tabs = useMemo(
    () => tabLabels.map((label) => <Tab key={`tab-${label}`} label={label} />),
    [tabLabels]
  );

  const nojsTabs = useMemo(
    () =>
      tabLabels.map((label) => (
        <Tab
          key={`tab2-${label}`}
          label={
            <a href={`${NOJS_ROUTE_PREFIX}/?tab=${label.toLowerCase()}`}>
              {label}
            </a>
          }
        />
      )),
    [tabLabels]
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

  return children({
    tabs: (
      <Tabs onSelectTab={onSetIndex} activeTabIndex={index} mode="horizontal">
        {javascriptEnabled ? tabs : nojsTabs}
      </Tabs>
    ),
    content: (
      <LazyList
        items={filteredRecords}
        renderItem={renderRecord}
        onFetchMore={handleFetchMoreRecords}
        hasMore={hasMore}
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
