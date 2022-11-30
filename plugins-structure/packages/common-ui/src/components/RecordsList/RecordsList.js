import React, { useEffect, useState } from "react";
import { Spinner } from "pi-ui";
import { InfiniteScroller } from "../InfiniteScroller";
import styles from "./styles.module.css";
import isFunction from "lodash/isFunction";

function getRecordsFromInventory(inventory, records) {
  const recordsFromInventory = [];
  if (inventory) {
    for (const token of inventory) {
      if (records[token]) {
        recordsFromInventory.push(records[token]);
      }
    }
  }
  return recordsFromInventory;
}

function areAllEntriesFetched(inventory, records) {
  if (!inventory) return false;
  for (const token of inventory) {
    if (!records[token]) return false;
  }
  return true;
}

function getLoadingPlaceholders(
  inventoryLength = 0,
  recordsLength = 0,
  Loader = Spinner
) {
  if (!inventoryLength) return [];
  const count = Math.max(Math.min(inventoryLength - recordsLength, 5), 0);
  const loadersArray = [];
  for (let i = 0; i < count; i++) {
    loadersArray.push(<Loader key={i} />);
  }
  return loadersArray;
}

export function RecordsList({
  loadingPlaceholder,
  children,
  // List display data
  inventory,
  records,
  // Fetch Status
  inventoryFetchStatus,
  listFetchStatus,
  // Pages sizes
  listPageSize,
  // Callbacks
  onFetchNextBatch,
  onFetchNextInventoryPage,
  onFetchDone,
}) {
  const [isDone, setIsDone] = useState(false);

  const recordsFromInventory = getRecordsFromInventory(inventory, records);
  const isMissingRecords = !areAllEntriesFetched(inventory, records);

  const hasMoreInventory = inventoryFetchStatus === "succeeded/hasMore";
  const hasMoreRecords = recordsFromInventory.length !== 0 && isMissingRecords;
  const isFetchDone =
    inventoryFetchStatus === "succeeded/isDone" && !isMissingRecords;

  function handleFetchMore() {
    if (hasMoreRecords) {
      onFetchNextBatch();
    } else if (hasMoreInventory) {
      onFetchNextInventoryPage();
    }
  }

  useEffect(() => {
    if (isFetchDone && !isDone) {
      setIsDone(true);
      onFetchDone && onFetchDone();
    }
  }, [onFetchDone, isFetchDone, isDone]);

  return inventory ? (
    <InfiniteScroller
      className={styles.recordsList}
      loadMore={handleFetchMore}
      loadingSkeleton={getLoadingPlaceholders(
        inventory?.length,
        recordsFromInventory?.length,
        loadingPlaceholder
      )}
      hasMore={hasMoreInventory || hasMoreRecords}
      childrenThreshold={listPageSize}
      isLoading={listFetchStatus === "loading"}
    >
      {isFunction(children) ? children(recordsFromInventory) : children}
    </InfiniteScroller>
  ) : null;
}
