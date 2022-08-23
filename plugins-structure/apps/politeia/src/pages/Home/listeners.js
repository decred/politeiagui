import {
  fetchInventory,
  fetchNextBatch,
  fetchNextBatchBillingStatuses,
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

function injectEffect(effect) {
  return async (action, { getState, dispatch }) => {
    const state = getState();
    const inventoryList = getInventoryList(action.payload, state);
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

function injectPayloadEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    await effect(state, dispatch, payload);
    subscribe();
  };
}

export const fetchInventoryListenerCreator = {
  actionCreator: fetchInventory,
  injectEffect: injectPayloadEffect,
};

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

export const fetchNextBatchBillingStatusesListenerCreator = {
  actionCreator: fetchNextBatchBillingStatuses,
  injectEffect,
};

export const fetchVoteSummariesListenerCreator = {
  type: "ticketvoteSummaries/fetch/fulfilled",
  injectEffect: injectPayloadEffect,
};

export const fetchRecordsListenerCreator = {
  type: "records/fetch/fulfilled",
  injectEffect: injectPayloadEffect,
};

export const fetchBillingStatusChangesListenerCreator = {
  type: "piBilling/fetchStatusChanges/fulfilled",
  injectEffect: injectPayloadEffect,
};

export const listeners = [
  {
    type: "ticketvoteInventory/fetch/fulfilled",
    effect: ({ meta, payload }, listenerApi) => {
      const { status } = meta.arg;
      if (payload.inventory[status].length > 0) {
        listenerApi.dispatch(fetchNextBatch(status));
      }
    },
  },
];
