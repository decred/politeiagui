import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTicketvoteInventory } from "../../ticketvote/inventory/useInventory";
import styles from "./styles.module.css";

export function TicketvoteInventoryWrapper({ status, children, onFetchDone }) {
  const [page, setPage] = useState(1);

  const { inventoryStatus, inventory } = useTicketvoteInventory({
    status,
    page,
  });

  const handleFetchInventoryNextPage = useCallback(async () => {
    if (inventoryStatus === "succeeded/hasMore") {
      setPage(page + 1);
    } else if (inventoryStatus === "succeeded/isDone") {
      await onFetchDone();
    }
  }, [inventoryStatus, page, onFetchDone]);

  return (
    <div className={styles.inventoryWrapper}>
      {children({
        onFetchInventoryNextPage: handleFetchInventoryNextPage,
        inventoryStatus,
        inventory,
      })}
    </div>
  );
}

TicketvoteInventoryWrapper.propTypes = {
  status: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};
