import { getHumanReadableTicketvoteStatus } from "@politeiagui/ticketvote/utils";
import { fetchNextCommentsCount } from "@politeiagui/comments/effects";
import { fetchNextRecords } from "@politeiagui/core/records/effects";
import { fetchNextTicketvoteSummaries } from "@politeiagui/ticketvote/effects";
import { fetchNextBatch } from "./actions";

const piFilenames = ["proposalmetadata.json", "votemetadata.json"];

export const listeners = [
  {
    type: "ticketvoteInventory/fetch/fulfilled",
    effect: ({ meta, payload }, listenerApi) => {
      if (payload.inventory[meta.arg.status].length > 0) {
        listenerApi.dispatch(fetchNextBatch(meta.arg.status));
      }
    },
  },
  {
    actionCreator: fetchNextBatch,
    effect: async (
      { payload },
      { getState, dispatch, subscribe, unsubscribe }
    ) => {
      unsubscribe();
      const readableStatus = getHumanReadableTicketvoteStatus(payload);
      const state = getState();
      const inventoryList = state.ticketvoteInventory[readableStatus].tokens;
      await Promise.all([
        fetchNextTicketvoteSummaries(state, dispatch, {
          inventoryList,
        }),
        fetchNextRecords(state, dispatch, {
          inventoryList,
          filenames: piFilenames,
        }),
        fetchNextCommentsCount(state, dispatch, {
          inventoryList,
        }),
      ]);
      subscribe();
    },
  },
];
