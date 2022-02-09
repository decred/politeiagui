import React, { useEffect } from "react";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { H1 } from "pi-ui";
import { RecordsList } from "@politeiagui/common-ui";
import { useDispatch, useSelector } from "react-redux";
import { fetchNextBatch, selectLastToken, selectStatus } from "../homeSlice";
import { ProposalCard } from "../../../components";

function StatusList({
  status,
  inventory,
  inventoryStatus,
  fetchNextInventoryPage,
  goToNextStatus,
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
      fetchNextInventoryPage();
    }
  }

  useEffect(() => {
    if (!hasMoreInventory && goToNextStatus) goToNextStatus();
  }, [hasMoreInventory, goToNextStatus]);

  const recordsInOrder = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );

  const summaries = useSelector(ticketvoteSummaries.selectAll);

  return (
    <div>
      <H1>{status}</H1>
      <RecordsList>
        {recordsInOrder.map((record) => {
          const { token } = record.censorshiprecord;
          return (
            <ProposalCard
              key={token}
              record={record}
              voteSummary={summaries[token]}
            />
          );
        })}
      </RecordsList>
      <button
        disabled={!hasMoreRecords && !hasMoreInventory}
        onClick={handleFetchMore}
      >
        Fetch more
      </button>
    </div>
  );
}

export default StatusList;
