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
