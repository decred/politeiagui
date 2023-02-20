import {
  fetchRecordsInventory,
  fetchRecordsUserInventory,
  selectRecordsInventoryByStateAndStatus,
  selectRecordsInventoryByUser,
  selectRecordsInventoryLastPage,
  selectRecordsInventoryStatus,
  selectRecordsUserInventoryStatus,
} from "./recordsInventorySlice";

export const recordsInventory = {
  fetch: fetchRecordsInventory,
  fetchUserInventory: fetchRecordsUserInventory,
  selectByStateAndStatus: selectRecordsInventoryByStateAndStatus,
  selectUserInventory: selectRecordsInventoryByUser,
  selectStatus: selectRecordsInventoryStatus,
  selectUserStatus: selectRecordsUserInventoryStatus,
  selectLastPage: selectRecordsInventoryLastPage,
};
