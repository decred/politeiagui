import React, { useState, useMemo, useEffect } from "react";
import { Tabs, Tab } from "pi-ui";
import LazyList from "src/components/LazyList";
import { getRecordsByTabOption } from "./helpers";
import HelpMessage from "src/components/HelpMessage";
import { useConfig } from "src/containers/Config";
import { NOJS_ROUTE_PREFIX, PROPOSAL_STATUS_CENSORED } from "src/constants";

const LoadingPlaceholders = ({ numberOfItems, placeholder }) => {
  const Item = placeholder;
  const placeholders = [];
  for (let i = 0; i < numberOfItems; i++) {
    placeholders.push(<Item key={`placeholder-${i}`} />);
  }
  return <>{placeholders}</>;
};

const getFilteredRecordsAndToken = (records, tokens, tab, filterCensored) => {
  console.log("getFilteredRecordsAndToken")
  // const tokens = fullTokens.map((token) => token.substring(0, 7));
  console.log(tokens)
  console.log(records)
  const filteredTokens = tokens[tab].map((token) => token.substring(0, 7));
  console.log("filteredTokens")
  console.log(filteredTokens)
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
  return [filteredRecords, filteredTokens];
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
  filterCensored
}) => {
  const [loadingItems, setLoadingItems] = useState(0);
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
    setLoadingItems(4);
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
