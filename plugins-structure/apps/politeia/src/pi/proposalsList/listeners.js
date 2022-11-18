import {
  fetchInventory,
  fetchNextBatch,
  fetchNextBatchBillingStatuses,
  fetchNextBatchCount,
  fetchNextBatchRecords,
  fetchNextBatchSummaries,
} from "./actions";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import { recordsInventory } from "@politeiagui/core/records/inventory";
import { getRfpProposalsLinks, proposalFilenames } from "../proposals/utils";

function getVoteInventoryList({ status }, state) {
  return ticketvoteInventory.selectByStatus(state, status);
}
function getRecordsInventoryList({ status, recordsState }, state) {
  return recordsInventory.selectByStateAndStatus(state, {
    recordsState,
    status,
  });
}

function injectVoteInventoryEffect(effect) {
  return async (action, { getState, dispatch }) => {
    const state = getState();
    const inventoryList = getVoteInventoryList(action.payload, state);
    await effect(state, dispatch, {
      inventoryList,
      filenames: proposalFilenames,
    });
  };
}
function injectRecordsInventoryEffect(effect) {
  return async (action, { getState, dispatch }) => {
    const state = getState();
    const inventoryList = getRecordsInventoryList(action.payload, state);
    await effect(state, dispatch, {
      inventoryList,
      filenames: proposalFilenames,
    });
  };
}

function injectPayloadEffect(effect) {
  return async ({ payload }, { getState, dispatch }) => {
    const state = getState();
    await effect(state, dispatch, payload);
  };
}

function injectRfpSubmissionsEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    const links = getRfpProposalsLinks(Object.values(payload));
    await effect(state, dispatch, {
      inventoryList: links,
      filenames: proposalFilenames,
    });
    subscribe();
  };
}
// Vote Inventory Listeners Creators
export const voteFetchNextBatchCountListenerCreator = {
  actionCreator: fetchNextBatchCount,
  injectEffect: injectVoteInventoryEffect,
};

export const voteFetchNextBatchSummariesListenerCreator = {
  actionCreator: fetchNextBatchSummaries,
  injectEffect: injectVoteInventoryEffect,
};

export const voteFetchNextBatchRecordsListenerCreator = {
  actionCreator: fetchNextBatchRecords,
  injectEffect: injectVoteInventoryEffect,
};

export const voteFetchNextBatchBillingStatusesListenerCreator = {
  actionCreator: fetchNextBatchBillingStatuses,
  injectEffect: injectVoteInventoryEffect,
};

// Records Inventory Listeners Creators
export const recordsFetchNextBatchCountListenerCreator = {
  actionCreator: fetchNextBatchCount,
  injectEffect: injectRecordsInventoryEffect,
};

export const recordsFetchNextBatchSummariesListenerCreator = {
  actionCreator: fetchNextBatchSummaries,
  injectEffect: injectRecordsInventoryEffect,
};

export const recordsFetchNextBatchRecordsListenerCreator = {
  actionCreator: fetchNextBatchRecords,
  injectEffect: injectRecordsInventoryEffect,
};

export const recordsFetchNextBatchBillingStatusesListenerCreator = {
  actionCreator: fetchNextBatchBillingStatuses,
  injectEffect: injectRecordsInventoryEffect,
};

// Common Listeners Creators
export const fetchInventoryListenerCreator = {
  actionCreator: fetchInventory,
  injectEffect: injectPayloadEffect,
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

export const fetchRecordsRfpSubmissionsListenerCreator = {
  type: "records/fetch/fulfilled",
  injectEffect: injectRfpSubmissionsEffect,
};

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
