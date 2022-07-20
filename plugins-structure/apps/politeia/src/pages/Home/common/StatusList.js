import React, { useEffect } from "react";
import { RecordsList } from "@politeiagui/common-ui";
import { useDispatch } from "react-redux";
import { ProposalCard, ProposalLoader } from "../../../components";
import max from "lodash/max";
import min from "lodash/min";
import useStatusList from "../useStatusList";

function LoadingSkeleton({ inventory, records }) {
  if (!inventory) return [];
  const loadingPlaceholdersCount = max([
    min([inventory.length - records.length, 5]),
    0,
  ]);
  const loadersArray = [];
  for (let i = 0; i < loadingPlaceholdersCount; i++) {
    loadersArray.push(<ProposalLoader key={i} />);
  }
  return loadersArray;
}

function StatusList({
  status,
  inventory,
  inventoryStatus,
  onFetchNextInventoryPage,
  onRenderNextStatus,
  recordsPageSize,
}) {
  const dispatch = useDispatch();
  const {
    hasMoreRecords,
    hasMoreInventory,
    homeStatus,
    countComments,
    voteSummaries,
    proposalSummaries,
    fetchNextBatch,
    recordsInOrder,
    areAllInventoryEntriesFetched,
  } = useStatusList({ inventory, inventoryStatus, status });

  function handleFetchMore() {
    if (hasMoreRecords) {
      dispatch(fetchNextBatch(status));
    } else if (hasMoreInventory) {
      onFetchNextInventoryPage();
    }
  }

  useEffect(() => {
    if (
      inventoryStatus === "succeeded/isDone" &&
      areAllInventoryEntriesFetched &&
      onRenderNextStatus
    ) {
      onRenderNextStatus();
    }
  }, [
    hasMoreInventory,
    onRenderNextStatus,
    inventoryStatus,
    areAllInventoryEntriesFetched,
  ]);

  const hasMoreToFetch = hasMoreRecords || hasMoreInventory;

  return (
    <div>
      <RecordsList
        hasMore={hasMoreToFetch}
        onFetchMore={handleFetchMore}
        isLoading={homeStatus === "loading"}
        childrenThreshold={recordsPageSize}
        loadingSkeleton={
          <LoadingSkeleton inventory={inventory} records={recordsInOrder} />
        }
      >
        {recordsInOrder.map((record) => {
          const { token } = record.censorshiprecord;
          return (
            <ProposalCard
              key={token}
              record={record}
              commentsCount={countComments?.[token]}
              voteSummary={voteSummaries?.[token]}
              proposalSummary={proposalSummaries?.[token]}
            />
          );
        })}
      </RecordsList>
    </div>
  );
}

export default StatusList;
