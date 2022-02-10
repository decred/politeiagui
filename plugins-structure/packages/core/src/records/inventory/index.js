import {
  fetchNextRecordsBatch,
  fetchRecordsInventory,
  selectHasMoreRecordsToFetch,
  selectRecordsInventoryByStateAndStatus,
  selectRecordsInventoryLastPage,
  selectRecordsInventoryStatus,
} from "./recordsInventorySlice";
import { useFetchRecordsInventory } from "./useFetchRecordsInventory";

export const recordsInventory = {
  fetch: fetchRecordsInventory,
  fetchNextRecordsBatch: fetchNextRecordsBatch,
  selectByStateAndStatus: selectRecordsInventoryByStateAndStatus,
  selectStatus: selectRecordsInventoryStatus,
  selectLastPage: selectRecordsInventoryLastPage,
  selectHasMoreRecordsToFetch,
  useFetch: useFetchRecordsInventory,
};
