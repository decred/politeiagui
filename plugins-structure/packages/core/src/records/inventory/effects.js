import { recordsInventory } from "./";

export async function fetchRecordsInventoryEffect(
  state,
  dispatch,
  { status, recordsState, page }
) {
  const fetchStatus = recordsInventory.selectStatus(state, {
    status,
    recordsState,
  });
  const fetchFirstPage = fetchStatus === "idle" && page === 1;
  const fetchLaterPages = fetchStatus === "succeeded/hasMore" && page > 1;
  if (fetchFirstPage || fetchLaterPages) {
    await dispatch(recordsInventory.fetch({ recordsState, status, page }));
  }
}

export async function fetchRecordsUserInventoryEffect(state, dispatch, userid) {
  const userRecordsInventory = recordsInventory.selectUserInventory(state, {
    userid,
  });
  if (!userRecordsInventory)
    await dispatch(recordsInventory.fetchUserInventory({ userid }));
}
