import {
  fetchRecordsInventory,
  selectRecordsInventoryByStateAndStatus,
  selectRecordsInventoryStatus,
} from "./recordsInventorySlice";
import { useFetchRecordsInventory } from "./useFetchRecordsInventory";

export const recordsInventory = {
  fetch: fetchRecordsInventory,
  selectByStateAndStatus: selectRecordsInventoryByStateAndStatus,
  selectStatus: selectRecordsInventoryStatus,
  useFetch: useFetchRecordsInventory,
};
