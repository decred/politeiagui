import React from "react";
import ProposalInventoryList from "./InventoryList";
import { Message } from "pi-ui";
import useVoteInventory from "../../pi/hooks/useVoteInventory";

function ProposalListVoteInventory({
  status,
  onRenderNextStatus,
  hasBillingStatus,
  listFetchStatus,
}) {
  const {
    inventory,
    inventoryError,
    inventoryStatus,
    onFetchNextInventoryPage,
  } = useVoteInventory({ status });

  return !inventoryError ? (
    <ProposalInventoryList
      status={status}
      onFetchNextInventoryPage={onFetchNextInventoryPage}
      inventoryStatus={inventoryStatus}
      inventory={inventory}
      onRenderNextStatus={onRenderNextStatus}
      hasBillingStatus={hasBillingStatus}
      listFetchStatus={listFetchStatus}
    />
  ) : (
    <div data-testid="proposals-list-error">
      <Message kind="error">{inventoryError}</Message>
    </div>
  );
}

export default ProposalListVoteInventory;
