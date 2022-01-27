import { useEffect } from "react";
import { recordsInventory } from "./";
import { useSelector, useDispatch } from "react-redux";

export function useFetchRecordsInventory({ recordsState, status, page = 1 }) {
  const dispatch = useDispatch();
  const recordsInvStatus = useSelector((state) =>
    recordsInventory.selectStatus(state, { recordsState, status })
  );

  useEffect(() => {
    const fetchFirstPage = recordsInvStatus === "idle" && page === 1;
    const fetchLaterPages =
      recordsInvStatus === "succeeded/hasMore" && page > 1;
    if (fetchFirstPage || fetchLaterPages) {
      dispatch(recordsInventory.fetch({ recordsState, status, page }));
    }
    // Disable rules of hooks because we don't want recordsInvStatus in our dependency list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, recordsState, status]);
  const recordsInv = useSelector((state) =>
    recordsInventory.selectByStateAndStatus(state, { recordsState, status })
  );
  return { status: recordsInvStatus, inventory: recordsInv };
}
