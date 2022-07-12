import { fetchNextBatch } from "./actions";
import { getHumanReadableTicketvoteStatus } from "@politeiagui/ticketvote/utils";

function getInventoryList(payload, state) {
  const readableStatus = getHumanReadableTicketvoteStatus(payload);
  return state.ticketvoteInventory[readableStatus].tokens;
}

const piFilenames = ["proposalmetadata.json", "votemetadata.json"];

function injectEffect(effect) {
  return async ({ payload }, { getState, dispatch }) => {
    const state = getState();
    const inventoryList = getInventoryList(payload, state);
    await effect(state, dispatch, { inventoryList });
  };
}

function injectRecordsBatchEffect(effect) {
  return async ({ payload }, { getState, dispatch }) => {
    const state = getState();
    const inventoryList = getInventoryList(payload, state);
    await effect(state, dispatch, { inventoryList, filenames: piFilenames });
  };
}

export const fetchNextBatchListenerCreator = {
  actionCreator: fetchNextBatch,
  injectEffect,
};

export const recordsFetchNextBatchListenerCreator = {
  actionCreator: fetchNextBatch,
  injectEffect: injectRecordsBatchEffect,
};

export const listeners = [
  {
    type: "ticketvoteInventory/fetch/fulfilled",
    effect: ({ meta, payload }, listenerApi) => {
      if (payload.inventory[meta.arg.status].length > 0) {
        listenerApi.dispatch(fetchNextBatch(meta.arg.status));
      }
    },
  },
];
