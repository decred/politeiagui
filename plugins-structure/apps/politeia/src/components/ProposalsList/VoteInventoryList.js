import React from "react";
import ProposalInventoryList from "./InventoryList";
import { Message } from "pi-ui";
import useVoteInventory from "../../pi/hooks/useVoteInventory";

function ProposalsListVoteInventory({
  status,
  onRenderNextStatus,
  hasBillingStatus,
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
      hasMoreInventory={inventoryStatus === "succeeded/hasMore"}
      isInventoryFetchDone={inventoryStatus === "succeeded/isDone"}
    />
  ) : (
    <div data-testid="proposals-list-error">
      <Message kind="error">{inventoryError}</Message>
    </div>
  );
}

export default ProposalsListVoteInventory;
