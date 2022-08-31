import React, { useEffect, useState } from "react";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import StatusList from "./StatusList";
import { Message } from "pi-ui";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory } from "../actions";

function RecordsStatusList({ status, onRenderNextStatus, hasBillingStatus }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  function handleFetchNextInventoryPage() {
    setPage(page + 1);
  }

  const inventoryError = useSelector(ticketvoteInventory.selectError);
  const inventoryStatus = useSelector((state) =>
    ticketvoteInventory.selectStatus(state, { status })
  );
  const inventory = useSelector((state) =>
    ticketvoteInventory.selectByStatus(state, status)
  );

  useEffect(() => {
    dispatch(fetchInventory({ status, page }));
  }, [status, page, dispatch]);

  return !inventoryError ? (
    <StatusList
      status={status}
      onFetchNextInventoryPage={handleFetchNextInventoryPage}
      inventoryStatus={inventoryStatus}
      inventory={inventory}
      onRenderNextStatus={onRenderNextStatus}
      hasBillingStatus={hasBillingStatus}
    />
  ) : (
    <div data-testid="proposals-list-error">
      <Message kind="error">{inventoryError}</Message>
    </div>
  );
}

export default RecordsStatusList;
