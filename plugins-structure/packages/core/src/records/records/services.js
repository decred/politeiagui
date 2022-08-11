import { validateRecordsPageSize } from "../validation";
import { store } from "../../storeSetup";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchAllRecordsInventory,
  fetchNextRecords,
  fetchRecordDetails,
} from "./effects";

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
