import { validateRecordsPageSize } from "../validation";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchAllRecordsInventory,
  fetchNextRecords,
  fetchRecordDetails,
} from "./effects";
import { fetchRecordDetails as onFetchRecordDetails } from "./recordsSlice";

import { createSliceServices } from "../../toolkit";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "records",
  services: {
    batch: {
      onSetup: async ({ getState }) => {
        await fetchPolicyIfIdle();
        validateRecordsPageSize(getState());
      },
      effect: fetchNextRecords,
    },
    batchAll: {
      onSetup: async ({ getState }) => {
        await fetchPolicyIfIdle();
        validateRecordsPageSize(getState());
      },
      effect: fetchAllRecordsInventory,
    },
    details: {
      effect: fetchRecordDetails,
    },
    // TODO: merge details service with the service below. Using this for now
    // to avoid changing out of scope code.
    detailsOnLoad: {
      onSetup: ({ params, dispatch }) => {
        const { token } = params || {};
        dispatch(onFetchRecordDetails({ token }));
      },
    },
  },
});
