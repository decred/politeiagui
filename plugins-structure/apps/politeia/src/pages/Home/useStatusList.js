import { useSelector } from "react-redux";
import { fetchNextBatch } from "./actions";
import { selectHomeStatus } from "./selectors";
import { records } from "@politeiagui/core/records";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";
import { piSummaries } from "../../pi/summaries";
import { piBilling } from "../../pi/billing";
import { proposals } from "../../pi/proposals";

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
  const voteSummaries = useSelector(ticketvoteSummaries.selectAll);
  const proposalSummaries = useSelector(piSummaries.selectAll);
  const recordsPageSize = useSelector((state) =>
    recordsPolicy.selectRule(state, "recordspagesize")
  );
  const recordsInOrder = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );
  const allRecords = useSelector(records.selectAll);
  const billingStatusChanges = useSelector(piBilling.selectAll);

  const proposalsStatusChanges = useSelector(proposals.selectAllStatusChanges);

  const hasMoreRecords =
    recordsInOrder.length !== 0 && recordsInOrder.length < inventory.length;

  const hasMoreInventory = inventoryStatus === "succeeded/hasMore";

  // Errors
  const recordsError = useSelector(records.selectError);

  return {
    hasMoreInventory,
    hasMoreRecords,
    homeStatus,
    countComments,
    voteSummaries,
    proposalSummaries,
    fetchNextBatch,
    recordsInOrder,
    recordsPageSize,
    recordsError,
    areAllInventoryEntriesFetched: areAllEntriesFetched(inventory, allRecords),
    billingStatusChanges,
    proposalsStatusChanges,
  };
}

export default useStatusList;
