import {
  fetchRecordsInventory,
  selectRecordsInventoryByStateAndStatus,
  selectRecordsInventoryLastPage,
  selectRecordsInventoryStatus,
} from "./recordsInventorySlice";

export const recordsInventory = {
  fetch: fetchRecordsInventory,
  selectByStateAndStatus: selectRecordsInventoryByStateAndStatus,
  selectStatus: selectRecordsInventoryStatus,
  selectLastPage: selectRecordsInventoryLastPage,
};
