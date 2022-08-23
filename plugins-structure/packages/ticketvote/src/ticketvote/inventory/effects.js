import { ticketvoteInventory } from "./";

export async function fetchTicketvoteRecordsInventory(
  state,
  dispatch,
  { status, page }
) {
  const lastPage = ticketvoteInventory.selectLastPage(state, { status });
  if (lastPage < page) {
    await dispatch(ticketvoteInventory.fetch({ status, page }));
  }
}
