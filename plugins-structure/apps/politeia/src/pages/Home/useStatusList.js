import { useSelector } from "react-redux";
import { fetchNextBatch } from "./actions";
import { selectHomeStatus } from "./selectors";
import { records } from "@politeiagui/core/records";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";

function areAllEntriesFetched(inventoryList, records) {
  if (!inventoryList) return false;
  for (const inventory of inventoryList) {
    if (!records[inventory]) return false;
  }
  return true;
}

function useStatusList({ inventory, inventoryStatus }) {
  const homeStatus = useSelector(selectHomeStatus);
  const countComments = useSelector(commentsCount.selectAll);
  const summaries = useSelector(ticketvoteSummaries.selectAll);
  const recordsPageSize = useSelector((state) =>
    recordsPolicy.selectRule(state, "recordspagesize")
  );
  const recordsInOrder = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );
  const allRecords = useSelector(records.selectAll);

  const hasMoreRecords =
    recordsInOrder.length !== 0 && recordsInOrder.length < inventory.length;

  const hasMoreInventory = inventoryStatus === "succeeded/hasMore";

  return {
    hasMoreInventory,
    hasMoreRecords,
    homeStatus,
    countComments,
    summaries,
    fetchNextBatch,
    recordsInOrder,
    recordsPageSize,
    areAllInventoryEntriesFetched: areAllEntriesFetched(inventory, allRecords),
  };
}

export default useStatusList;
