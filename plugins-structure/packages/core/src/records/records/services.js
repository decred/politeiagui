import { validateRecordsPageSize } from "../validation";
import { store } from "../../storeSetup";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchAllRecordsInventory,
  fetchNextRecords,
  fetchRecordDetails,
} from "./effects";

import { createSliceServices } from "../../toolkit";

// TODO: remove this and use slice services.
export const services = [
  {
    id: "records/batch",
    action: async () => {
      await fetchPolicyIfIdle();
      validateRecordsPageSize(store.getState());
    },
    effect: fetchNextRecords,
  },
  {
    id: "records/batch/all",
    action: async () => {
      await fetchPolicyIfIdle();
      validateRecordsPageSize(store.getState());
    },
    effect: fetchAllRecordsInventory,
  },
  {
    id: "records/details",
    effect: fetchRecordDetails,
  },
];

export const sliceServices = createSliceServices({
  name: "records",
  services: {
    batch: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
        validateRecordsPageSize(store.getState());
      },
      effect: fetchNextRecords,
    },
    batchAll: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
        validateRecordsPageSize(store.getState());
      },
      effect: fetchAllRecordsInventory,
    },
    details: {
      effect: fetchRecordDetails,
    },
  },
});
