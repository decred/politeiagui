import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNextBatch } from "./actions";
import { selectHomeStatus } from "./selectors";
import { records } from "@politeiagui/core/records";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";

function useStatusList({ status, inventory, inventoryStatus }) {
  const dispatch = useDispatch();
  const homeStatus = useSelector(selectHomeStatus);
  const countComments = useSelector(commentsCount.selectAll);
  const summaries = useSelector(ticketvoteSummaries.selectAll);
  const recordsPageSize = useSelector((state) =>
    recordsPolicy.selectRule(state, "recordspagesize")
  );
  const recordsInOrder = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );

  // Fetch first batch on first render
  // This only triggers the fetchNextBatch action when the records
  // array is empty on purpose because after it has one or more elements
  // the infiniteScroller will be responsible for calling it.
  useEffect(() => {
    if (
      inventory.length > 0 &&
      recordsInOrder.length === 0 &&
      homeStatus !== "loading"
    ) {
      dispatch(fetchNextBatch(status));
    }
  }, [dispatch, inventory, status, recordsInOrder, homeStatus]);

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
  };
}

export default useStatusList;
