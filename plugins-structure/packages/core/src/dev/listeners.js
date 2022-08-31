import { createAction } from "@reduxjs/toolkit";
import {
  getHumanReadableRecordState,
  getHumanReadableRecordStatus,
} from "../records/utils";

export const fetchNextBatch = createAction("records/fetchNextBatch");

export const fetchNextBatchListenerCreator = {
  actionCreator: fetchNextBatch,
  injectEffect:
    (effect) =>
    async ({ payload: { recordsState, status } }, { dispatch, getState }) => {
      const readableRecordsState = getHumanReadableRecordState(recordsState);
      const readableStatus = getHumanReadableRecordStatus(status);
      const state = getState();
      const { recordsInventory } = state;
      const inventoryList =
        recordsInventory[readableRecordsState][readableStatus].tokens;
      await effect(state, dispatch, { inventoryList });
    },
};
