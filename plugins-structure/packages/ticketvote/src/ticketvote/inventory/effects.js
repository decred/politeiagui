import { ticketvoteInventory } from "./";

export async function fetchTicketvoteRecordsInventory(
  state,
  dispatch,
  { status, page }
) {
  const fetchStatus = ticketvoteInventory.selectStatus(state, { status });
  const fetchFirstPage = fetchStatus === "idle" && page === 1;
  const fetchLaterPages = fetchStatus === "succeeded/hasMore" && page > 1;
  if (fetchFirstPage || fetchLaterPages) {
    await dispatch(ticketvoteInventory.fetch({ status, page }));
  }
}
