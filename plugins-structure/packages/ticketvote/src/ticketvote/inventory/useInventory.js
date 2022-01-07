import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ticketvoteInventory } from "./";

export function useTicketvoteInventory({ status, page = 1, pageSize = 20 }) {
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

  // Actions
  const onFetchMore = useCallback(
    (status, page) =>
      dispatch(ticketvoteInventory.fetch({ status, page, pageSize })),
    [dispatch, pageSize]
  );

  // Effects
  useEffect(() => {
    const fetchFirstPage = inventoryStatus === "idle" && page === 1;
    if (fetchFirstPage) {
      onFetchMore(status, page);
    }
  }, [page, status, inventoryStatus, onFetchMore]);

  return {
    inventory,
    inventoryError,
    inventoryStatus,
    onFetchMore,
  };
}
