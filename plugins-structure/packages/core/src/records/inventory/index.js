import {
  fetchRecordsInventory,
  selectRecordsInventoryByStateAndStatus,
  selectRecordsInventoryLastPage,
  selectRecordsInventoryStatus,
} from "./recordsInventorySlice";
import { useFetchRecordsInventory } from "./useFetchRecordsInventory";

export const recordsInventory = {
  fetch: fetchRecordsInventory,
  selectByStateAndStatus: selectRecordsInventoryByStateAndStatus,
  selectStatus: selectRecordsInventoryStatus,
  selectLastPage: selectRecordsInventoryLastPage,
  useFetch: useFetchRecordsInventory,
};
