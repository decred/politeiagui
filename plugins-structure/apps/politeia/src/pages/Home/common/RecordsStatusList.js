import React, { useEffect, useState } from "react";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import StatusList from "./StatusList";

function RecordsStatusList({ status, onRenderNextStatus }) {
  const [page, setPage] = useState(1);
  function handleFetchNextInventoryPage() {
    setPage(page + 1);
  }
  const { inventoryStatus, inventory } = ticketvoteInventory.useFetch({
    status,
    page,
  });

  useEffect(() => {
    if (inventoryStatus === "succeeded/isDone" && inventory.length === 0)
      onRenderNextStatus && onRenderNextStatus();
  }, [inventoryStatus, inventory, onRenderNextStatus]);

  // No need to render StatusList component if inventory list is empty
  return inventory.length > 0 ? (
    <StatusList
      status={status}
      onFetchNextInventoryPage={handleFetchNextInventoryPage}
      inventoryStatus={inventoryStatus}
      inventory={inventory}
      onRenderNextStatus={onRenderNextStatus}
    />
  ) : null;
}

export default RecordsStatusList;
