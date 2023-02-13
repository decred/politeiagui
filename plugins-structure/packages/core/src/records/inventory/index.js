import {
  fetchRecordsInventory,
  fetchRecordsUserInventory,
  selectRecordsInventoryByStateAndStatus,
  selectRecordsInventoryLastPage,
  selectRecordsInventoryStatus,
  selectRecordsUserInventoryStatus,
} from "./recordsInventorySlice";

export const recordsInventory = {
  fetch: fetchRecordsInventory,
  fetchUserInventory: fetchRecordsUserInventory,
  selectByStateAndStatus: selectRecordsInventoryByStateAndStatus,
  selectStatus: selectRecordsInventoryStatus,
  selectUserStatus: selectRecordsUserInventoryStatus,
  selectLastPage: selectRecordsInventoryLastPage,
};
