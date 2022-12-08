import { validateRecordsPageSize } from "../validation";
import { store } from "../../storeSetup";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchAllRecordsInventory,
  fetchNextRecords,
  fetchRecordDetails,
} from "./effects";

import { createSliceServices } from "../../toolkit";

export const { pluginServices, serviceListeners } = createSliceServices({
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
