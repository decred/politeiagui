import React, { useEffect } from "react";
import { RecordsList } from "@politeiagui/common-ui";
import { useDispatch } from "react-redux";
import { ProposalCard, ProposalLoader } from "../../../components";
import max from "lodash/max";
import useStatusList from "../useStatusList";

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

  const loadingPlaceholdersCount = max([
    inventory.length - recordsInOrder.length,
    0,
  ]);

  return (
    <div>
      <RecordsList
        hasMore={hasMoreToFetch}
        onFetchMore={handleFetchMore}
        isLoading={homeStatus === "loading"}
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
      {Array(loadingPlaceholdersCount)
        .fill("")
        .map((_, i) => (
          <ProposalLoader key={i} />
        ))}
    </div>
  );
}

export default StatusList;
