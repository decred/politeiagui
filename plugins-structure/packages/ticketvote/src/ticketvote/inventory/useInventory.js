import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketvoteInventory } from "./";

// TODO: redo without fetchNextRecordsBatch from recordsInventory
export function useTicketvoteInventory({ status, page = 1 }) {
  const dispatch = useDispatch();
  // Selectors
  const inventoryStatus = useSelector((state) =>
    ticketvoteInventory.selectStatus(state, { status })
  );
  const inventory = useSelector((state) =>
    ticketvoteInventory.selectByStatus(state, status)
  );
  const inventoryError = useSelector((state) =>
    ticketvoteInventory.selectError(state)
  );

  // Effects
  useEffect(() => {
    const fetchFirstPage = inventoryStatus === "idle" && page === 1;
    const fetchLaterPages = inventoryStatus === "succeeded/hasMore" && page > 1;
    if (fetchFirstPage || fetchLaterPages) {
      dispatch(ticketvoteInventory.fetch({ status, page }));
    }
    // Disable rules of hooks because we don't want inventoryStatus in our
    // dependency list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, status]);

  return {
    inventory,
    inventoryError,
    inventoryStatus,
  };
}
