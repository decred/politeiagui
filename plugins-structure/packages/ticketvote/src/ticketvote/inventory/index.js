import {
  fetchTicketvoteInventory,
  fetchTicketvoteNextRecordsPage,
  selectRecordsByTicketvoteStatus,
  selectRecordsByTicketvoteStatuses,
  selectTicketvoteInventoryByStatus,
  selectTicketvoteInventoryError,
  selectTicketvoteInventoryLastPage,
  selectTicketvoteInventoryStatus,
  selectTicketvoteRecordsQueueStatus,
} from "./inventorySlice";

export const ticketvoteInventory = {
  fetch: fetchTicketvoteInventory,
  fetchNextRecordsPage: fetchTicketvoteNextRecordsPage,
  selectByStatus: selectTicketvoteInventoryByStatus,
  selectError: selectTicketvoteInventoryError,
  selectLastPage: selectTicketvoteInventoryLastPage,
  selectRecordsByStatus: selectRecordsByTicketvoteStatus,
  selectRecordsByStatuses: selectRecordsByTicketvoteStatuses,
  selectRecordsQueueStatus: selectTicketvoteRecordsQueueStatus,
  selectStatus: selectTicketvoteInventoryStatus,
};
