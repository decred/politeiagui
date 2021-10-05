import React, { useState } from "react";
import { useFetchRecordsInventory } from "../inventory/useFetchRecordsInventory";
import {
  fetchRecordsNextPage,
  selectRecordsByStateAndStatus,
  selectHasMoreRecordsToFetch,
} from "../records/recordsSlice";
import { useDispatch, useSelector } from "react-redux";

// fetch inventory and pass it down
export function RecordsListWrapper({ recordsState, status }) {
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
    <RecordsList
      recordsState={recordsState}
      status={status}
      inventoryStatus={inventoryStatus}
      fetchOneMoreInventoryPage={fetchOneMoreInventoryPage}
    />
  ) : (
    "Loading"
  );
}

function RecordsList({
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
          <div key={token}>
            <a href={`/records/${token}`} data-link>
              {token}
            </a>
          </div>
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
