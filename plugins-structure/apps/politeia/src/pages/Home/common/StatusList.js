import React, { useEffect } from "react";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";
import { RecordsList } from "@politeiagui/common-ui";
import { useDispatch, useSelector } from "react-redux";
// import { fetchNextBatch, selectLastToken, selectStatus } from "../homeSlice";
import { fetchNextBatch } from "../actions";
import { ProposalCard, ProposalLoader } from "../../../components";
import max from "lodash/max";

function StatusList({
  status,
  inventory,
  inventoryStatus,
  onFetchNextInventoryPage,
  onRenderNextStatus,
}) {
  const dispatch = useDispatch();
  const countComments = useSelector(commentsCount.selectAll);
  const summaries = useSelector(ticketvoteSummaries.selectAll);
  const recordsInOrder = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );

  // Fetch first batch on first render
  useEffect(() => {
    if (inventory.length > 0) {
      dispatch(fetchNextBatch(status));
    }
  }, [dispatch, inventory, status]);

  const hasMoreRecords =
    recordsInOrder.length !== 0 && recordsInOrder.length < inventory.length;
  const hasMoreInventory = inventoryStatus === "succeeded/hasMore";

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
      <RecordsList hasMore={hasMoreToFetch} onFetchMore={handleFetchMore}>
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
