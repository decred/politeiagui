import React, { useState } from "react";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import StatusList from "./StatusList";
import { Message } from "pi-ui";

function RecordsStatusList({ status, onRenderNextStatus }) {
  const [page, setPage] = useState(1);
  function handleFetchNextInventoryPage() {
    setPage(page + 1);
  }

  const { inventoryStatus, inventory, inventoryError } =
    ticketvoteInventory.useFetch({
      status,
      page,
    });

  return !inventoryError ? (
    <StatusList
      status={status}
      onFetchNextInventoryPage={handleFetchNextInventoryPage}
      inventoryStatus={inventoryStatus}
      inventory={inventory}
      onRenderNextStatus={onRenderNextStatus}
    />
  ) : (
    <div data-testid="proposals-list-error">
      <Message kind="error">{inventoryError}</Message>
    </div>
  );
}

export default RecordsStatusList;
