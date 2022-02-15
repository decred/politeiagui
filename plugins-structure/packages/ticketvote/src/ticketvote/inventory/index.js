import {
  fetchTicketvoteInventory,
  fetchTicketvoteNextRecordsBatch,
  selectRecordsByTicketvoteStatus,
  selectRecordsByTicketvoteStatuses,
  selectTicketvoteInventoryByStatus,
  selectTicketvoteInventoryError,
  selectTicketvoteInventoryLastPage,
  selectTicketvoteInventoryStatus,
} from "./inventorySlice";
import { useTicketvoteInventory } from "./useInventory";

export const ticketvoteInventory = {
  fetch: fetchTicketvoteInventory,
  fetchNextRecordsBatch: fetchTicketvoteNextRecordsBatch,
  selectByStatus: selectTicketvoteInventoryByStatus,
  selectError: selectTicketvoteInventoryError,
  selectLastPage: selectTicketvoteInventoryLastPage,
  selectRecordsByStatus: selectRecordsByTicketvoteStatus,
  selectRecordsByStatuses: selectRecordsByTicketvoteStatuses,
  selectStatus: selectTicketvoteInventoryStatus,
  useFetch: useTicketvoteInventory,
};
