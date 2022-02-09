import React, { useState } from "react";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import StatusList from "./StatusList";

function RecordsStatusList({ status, goToNextStatus }) {
  const [page, setPage] = useState(1);
  function fetchNextInventoryPage() {
    setPage(page + 1);
  }
  const { inventoryStatus, inventory } = ticketvoteInventory.useFetch({
    status,
    page,
  });

  return inventoryStatus !== "idle" && inventoryStatus !== "loading" ? (
    <StatusList
      status={status}
      fetchNextInventoryPage={fetchNextInventoryPage}
      inventoryStatus={inventoryStatus}
      inventory={inventory}
      goToNextStatus={goToNextStatus}
    />
  ) : (
    "Loading ..."
  );
}

export default RecordsStatusList;
