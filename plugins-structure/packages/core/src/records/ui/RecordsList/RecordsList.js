import React, { useState } from "react";
import { recordsInventory } from "../../inventory";
import { records } from "../../records";
import { useDispatch, useSelector } from "react-redux";
import RecordCard from "../RecordCard";
import styles from "./styles.module.css";

// fetch inventory and pass it down
export function RecordsList({ recordsState, status }) {
  const [page, setPage] = useState(1);
  const { status: inventoryStatus, inventory } = recordsInventory.useFetch({
    recordsState,
    status,
    page,
  });
  function fetchOneMoreInventoryPage() {
    setPage(page + 1);
  }

  return inventoryStatus !== "idle" ? (
    <RecordsListAux
      recordsState={recordsState}
      status={status}
      inventory={inventory}
      inventoryStatus={inventoryStatus}
      fetchOneMoreInventoryPage={fetchOneMoreInventoryPage}
    />
  ) : (
    "Loading"
  );
}

function RecordsListAux({
  recordsState,
  status,
  inventory,
  inventoryStatus,
  fetchOneMoreInventoryPage,
}) {
  const dispatch = useDispatch();
  const recordsObj = useSelector((state) =>
    records.selectByStateAndStatus(state, { recordsState, status })
  );
  // Guarantee that we show records the same order they show on inventory
  const recordsInOrder = inventory.reduce(
    (acc, token) => (recordsObj[token] ? [...acc, recordsObj[token]] : acc),
    []
  );
  const hasMoreInventory = inventoryStatus === "succeeded/hasMore";
  const hasMoreRecords = useSelector((state) =>
    records.selectHasMoreToFetch(state, { recordsState, status })
  );

  function handleFetchMore() {
    console.log(hasMoreRecords);
    if (hasMoreRecords) {
      dispatch(records.fetchNextPage({ recordsState, status }));
    } else if (hasMoreInventory) {
      fetchOneMoreInventoryPage();
    }
  }
  return (
    <>
      <ul className={styles.recordsList}>
        {recordsInOrder.map((record) => {
          const { token } = record.censorshiprecord;
          return <RecordCard key={token} token={token} />;
        })}
      </ul>
      <button
        disabled={!hasMoreRecords && !hasMoreInventory}
        onClick={handleFetchMore}
      >
        Fetch More
      </button>
    </>
  );
}
