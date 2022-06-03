import React, { useEffect } from "react";
import { RecordsList } from "@politeiagui/common-ui";
import { useDispatch } from "react-redux";
import { ProposalCard, ProposalLoader } from "../../../components";
import max from "lodash/max";
import min from "lodash/min";
import useStatusList from "../useStatusList";

function LoadingSkeleton({ inventory, records }) {
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
}) {
  const dispatch = useDispatch();
  const {
    hasMoreRecords,
    hasMoreInventory,
    homeStatus,
    countComments,
    summaries,
    fetchNextBatch,
    recordsInOrder,
  } = useStatusList({ inventory, inventoryStatus, status });

  function handleFetchMore() {
    if (hasMoreRecords) {
      dispatch(fetchNextBatch(status));
    } else if (hasMoreInventory) {
      onFetchNextInventoryPage();
    }
  }

  useEffect(() => {
    if (!hasMoreInventory && onRenderNextStatus) onRenderNextStatus();
  }, [hasMoreInventory, onRenderNextStatus]);

  const hasMoreToFetch = hasMoreRecords || hasMoreInventory;

  return (
    <div>
      <RecordsList
        hasMore={hasMoreToFetch}
        onFetchMore={handleFetchMore}
        isLoading={homeStatus === "loading"}
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
              commentsCount={countComments[token]}
              voteSummary={summaries[token]}
            />
          );
        })}
      </RecordsList>
    </div>
  );
}

export default StatusList;
