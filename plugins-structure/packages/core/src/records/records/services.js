import { validateRecordsPageSize } from "../validation";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchAllRecordsInventory,
  fetchNextRecords,
  fetchRecordDetails,
} from "./effects";
import {
  fetchRecordDetails as onFetchRecordDetails,
  // selectRecordByShortToken,
} from "./recordsSlice";

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
    // TODO: Deprecate this service and use the one below.
    details: {
      effect: fetchRecordDetails,
    },
    // TODO: merge details service with the service below. Using this for now
    // to keep the same scope of this PR.
    detailsOnLoad: {
      onSetup: ({ params, dispatch }) => {
        const { token } = params || {};
        if (!token) return;
        // FIXME: This is a temporary fix to avoid issues from listeners logic.
        // Ideally, we should handle this issue on service listeners config
        // level, but in order to keep the same scope of this PR, records
        // details will be fetched on every page load.
        dispatch(onFetchRecordDetails({ token }));
        // TODO: Uncomment this code when the issue above is fixed.
        // (the `getState` param is retreived from onSetup args).
        // const record = selectRecordByShortToken(getState(), token);
        // if (!record?.detailsFetched) {
        //   dispatch(onFetchRecordDetails({ token }));
        // }
      },
    },
  },
});
