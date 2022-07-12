import { validateRecordsPageSize } from "../validation";
import { store } from "../../storeSetup";
import { fetchPolicyIfIdle } from "../utils";
import { fetchNextRecords, fetchRecordDetails } from "./effects";

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
    id: "records/details",
    effect: fetchRecordDetails,
  },
];
