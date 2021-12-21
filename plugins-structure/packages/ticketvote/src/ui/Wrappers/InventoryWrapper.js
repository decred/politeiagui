import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTicketvoteInventory } from "../../ticketvote/inventory/useInventory";
import styles from "./styles.module.css";

export function TicketvoteInventoryWrapper({
  status,
  children,
  pageSize,
  onFetchDone,
}) {
  const [page, setPage] = useState(1);

  const { inventoryStatus, onFetchMore, inventory } = useTicketvoteInventory({
    status,
    page,
    pageSize,
  });

  const handleFetchInventoryNextPage = useCallback(async () => {
    if (inventoryStatus === "succeeded/hasMore") {
      await onFetchMore(status, page + 1);
      setPage(page + 1);
    } else if (inventoryStatus === "succeeded/isDone") {
      await onFetchDone();
    }
  }, [inventoryStatus, onFetchMore, status, page, onFetchDone]);

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
