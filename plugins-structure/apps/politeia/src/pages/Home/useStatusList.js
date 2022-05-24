import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNextBatch } from "./actions";
import { selectHomeStatus } from "./selectors";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";

function useStatusList({ status, inventory, inventoryStatus }) {
  const dispatch = useDispatch();
  const homeStatus = useSelector(selectHomeStatus);
  const countComments = useSelector(commentsCount.selectAll);
  const summaries = useSelector(ticketvoteSummaries.selectAll);
  const recordsInOrder = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );

  // Fetch first batch on first render
  useEffect(() => {
    if (inventory.length > 0 && recordsInOrder.length === 0) {
      dispatch(fetchNextBatch(status));
    }
  }, [dispatch, inventory, status, recordsInOrder]);

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
  };
}

export default useStatusList;
