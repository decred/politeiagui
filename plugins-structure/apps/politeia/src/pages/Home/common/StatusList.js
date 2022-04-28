import React, { useEffect, useMemo } from "react";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";
import { RecordsList } from "@politeiagui/common-ui";
import { useDispatch, useSelector } from "react-redux";
import { fetchNextBatch, selectLastToken, selectStatus } from "../homeSlice";
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

  const fetchStatus = useSelector((state) => selectStatus(state, status));

  useEffect(() => {
    if (inventory.length > 0 && fetchStatus === "idle") {
      dispatch(fetchNextBatch(status));
    }
  }, [dispatch, fetchStatus, inventory, status]);

  const hasMoreInventory = inventoryStatus === "succeeded/hasMore";
  const lastTokenPos = useSelector((state) => selectLastToken(state, status));
  const hasMoreRecords =
    lastTokenPos !== null && lastTokenPos < inventory.length - 1;

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

  const recordsInOrder = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );

  const countComments = useSelector(commentsCount.selectAll);

  const summaries = useSelector(ticketvoteSummaries.selectAll);

  const hasMoreToFetch = useMemo(
    () => fetchStatus === "succeeded" && (hasMoreRecords || hasMoreInventory),
    [hasMoreRecords, hasMoreInventory, fetchStatus]
  );

  const loadingPlaceholdersCount = max([
    inventory.length - 1 - lastTokenPos,
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
