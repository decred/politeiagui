import {
  fetchTicketvoteInventory,
  selectTicketvoteInventoryByStatus,
  selectTicketvoteInventoryError,
  selectTicketvoteInventoryLastPage,
  selectTicketvoteInventoryStatus,
} from "./inventorySlice";
import { useTicketvoteInventory } from "./useInventory";

export const ticketvoteInventory = {
  fetch: fetchTicketvoteInventory,
  selectByStatus: selectTicketvoteInventoryByStatus,
  selectError: selectTicketvoteInventoryError,
  selectLastPage: selectTicketvoteInventoryLastPage,
  selectStatus: selectTicketvoteInventoryStatus,
  useFetch: useTicketvoteInventory,
};
