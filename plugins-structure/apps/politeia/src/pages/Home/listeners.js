import {
  fetchNextBatch,
  fetchNextBatchCount,
  fetchNextBatchRecords,
  fetchNextBatchSummaries,
} from "./actions";
import { getHumanReadableTicketvoteStatus } from "@politeiagui/ticketvote/utils";

function getInventoryList(payload, state) {
  const readableStatus = getHumanReadableTicketvoteStatus(payload);
  return state.ticketvoteInventory[readableStatus].tokens;
}

const piFilenames = ["proposalmetadata.json", "votemetadata.json"];

let i = 0;

function injectEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    const inventoryList = getInventoryList(payload, state);
    await effect(state, dispatch, { inventoryList });
    subscribe();
  };
}

function injectRecordsBatchEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    const inventoryList = getInventoryList(payload, state);
    await effect(state, dispatch, { inventoryList, filenames: piFilenames });
    subscribe();
  };
}

export const fetchNextBatchCountListenerCreator = {
  actionCreator: fetchNextBatchCount,
  injectEffect,
};

export const fetchNextBatchSummariesListenerCreator = {
  actionCreator: fetchNextBatchSummaries,
  injectEffect,
};

export const fetchNextBatchRecordsListenerCreator = {
  actionCreator: fetchNextBatchRecords,
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
