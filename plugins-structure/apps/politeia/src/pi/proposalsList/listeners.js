import { fetchNextBatch } from "./actions";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import { recordsInventory } from "@politeiagui/core/records/inventory";

// Listeners without services
export const listenToVoteInventoryFetch = {
  actionCreator: ticketvoteInventory.fetch.fulfilled,
  effect: ({ meta, payload }, listenerApi) => {
    const { status } = meta.arg;
    if (payload.inventory[status].length > 0) {
      listenerApi.dispatch(fetchNextBatch({ status }));
    }
  },
};

export const listenToRecordsInventoryFetch = {
  actionCreator: recordsInventory.fetch.fulfilled,
  effect: ({ meta, payload }, { dispatch }) => {
    const { recordsState, status } = meta.arg;
    if (payload.recordsInventory[recordsState][status].length > 0) {
      dispatch(fetchNextBatch({ status, recordsState }));
    }
  },
};
