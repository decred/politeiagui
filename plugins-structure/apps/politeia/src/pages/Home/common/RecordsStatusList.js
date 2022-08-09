import React, { useState } from "react";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import StatusList from "./StatusList";

function RecordsStatusList({ status, onRenderNextStatus, hasBillingStatus }) {
  const [page, setPage] = useState(1);
  function handleFetchNextInventoryPage() {
    setPage(page + 1);
  }

  const { inventoryStatus, inventory } = ticketvoteInventory.useFetch({
    status,
    page,
  });

  return (
    <StatusList
      status={status}
      onFetchNextInventoryPage={handleFetchNextInventoryPage}
      inventoryStatus={inventoryStatus}
      inventory={inventory}
      onRenderNextStatus={onRenderNextStatus}
      hasBillingStatus={hasBillingStatus}
    />
  );
}

export default RecordsStatusList;
