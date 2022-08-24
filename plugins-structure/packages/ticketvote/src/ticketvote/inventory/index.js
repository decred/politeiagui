import {
  fetchTicketvoteInventory,
  selectTicketvoteInventoryByStatus,
  selectTicketvoteInventoryError,
  selectTicketvoteInventoryLastPage,
  selectTicketvoteInventoryStatus,
} from "./inventorySlice";

export const ticketvoteInventory = {
  fetch: fetchTicketvoteInventory,
  selectByStatus: selectTicketvoteInventoryByStatus,
  selectError: selectTicketvoteInventoryError,
  selectLastPage: selectTicketvoteInventoryLastPage,
  selectStatus: selectTicketvoteInventoryStatus,
};
