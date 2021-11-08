import React, { useState } from "react";
import { useFetchRecordsInventory } from "../inventory/useFetchRecordsInventory";
import {
  fetchRecordsNextPage,
  selectRecordsByStateAndStatus,
  selectHasMoreRecordsToFetch,
} from "../records/recordsSlice";
import { useDispatch, useSelector } from "react-redux";
import RecordCard from "./RecordCard";

// fetch inventory and pass it down
export function RecordsList({ recordsState, status }) {
  const [page, setPage] = useState(1);
  const { status: inventoryStatus } = useFetchRecordsInventory({
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
  inventoryStatus,
  fetchOneMoreInventoryPage,
}) {
  const dispatch = useDispatch();
  const records = useSelector((state) =>
    selectRecordsByStateAndStatus(state, { recordsState, status })
  );
  const hasMoreInventory = inventoryStatus === "succeeded/hasMore";
  const hasMoreRecords = useSelector((state) =>
    selectHasMoreRecordsToFetch(state, { recordsState, status })
  );

  function handleFetchMore() {
    if (hasMoreRecords) {
      dispatch(fetchRecordsNextPage({ recordsState, status }));
    } else if (hasMoreInventory) {
      fetchOneMoreInventoryPage();
    }
  }
  return (
    <>
      <h1>Records</h1>
      <h3>{recordsState}</h3>
      <h3>{status}</h3>
      {records.map((record) => {
        const { token } = record.censorshiprecord;
        return (
          <RecordCard key={token} token={token} />
        );
      })}
      <button
        disabled={!hasMoreRecords && !hasMoreInventory}
        onClick={handleFetchMore}
      >
        Fetch More
      </button>
    </>
  );
}
