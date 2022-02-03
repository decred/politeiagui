import {
  fetchRecordsInventory,
  fetchNextRecordsBatch,
  selectRecordsInventoryByStateAndStatus,
  selectRecordsInventoryStatus,
  selectRecordsInventoryLastPage,
  selectHasMoreRecordsToFetch,
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
