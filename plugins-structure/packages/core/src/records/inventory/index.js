import {
  fetchRecordsInventory,
  selectRecordsInventoryByStateAndStatus,
  selectRecordsInventoryStatus,
  selectRecordsInventoryLastPage,
} from "./recordsInventorySlice";
import { useFetchRecordsInventory } from "./useFetchRecordsInventory";

export const recordsInventory = {
  fetch: fetchRecordsInventory,
  selectByStateAndStatus: selectRecordsInventoryByStateAndStatus,
  selectStatus: selectRecordsInventoryStatus,
  selectLastPage: selectRecordsInventoryLastPage,
  useFetch: useFetchRecordsInventory,
};
