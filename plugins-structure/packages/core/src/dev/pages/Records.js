import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordsInventory } from "../../records/inventory";
import { records } from "../../records/records";
import { fetchNextBatch } from "../listeners";

// fetch inventory and pass it down
export function RecordsList({ recordsState, status }) {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const inventory = useSelector((state) =>
    recordsInventory.selectByStateAndStatus(state, { recordsState, status })
  );
  const inventoryStatus = useSelector((state) =>
    recordsInventory.selectStatus(state, { recordsState, status })
  );

  useEffect(() => {
    if (inventoryStatus === "idle" || inventoryStatus === "succeeded/hasMore") {
      dispatch(recordsInventory.fetch({ recordsState, status, page }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordsState, status, dispatch, page]);

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

  useEffect(() => {
    if (inventory.length > 0) {
      dispatch(fetchNextBatch({ recordsState, status }));
    }
  }, [dispatch, inventory, recordsState, status]);

  const recordsObj = useSelector((state) =>
    records.selectByStateAndStatus(state, { recordsState, status })
  );
  // Guarantee that we show records the same order they show on inventory
  const recordsInOrder = inventory.reduce(
    (acc, token) => (recordsObj[token] ? [...acc, recordsObj[token]] : acc),
    []
  );
  const hasMoreInventory = inventoryStatus === "succeeded/hasMore";
  const hasMoreRecords =
    recordsInOrder.length > 0 && recordsInOrder.length < inventory.length;

  function handleFetchMore() {
    if (hasMoreRecords) {
      dispatch(fetchNextBatch({ recordsState, status }));
    } else if (hasMoreInventory) {
      fetchOneMoreInventoryPage();
    }
  }
  return (
    <>
      <ul>
        {recordsInOrder.map((record) => {
          const { token } = record.censorshiprecord;
          return (
            <li key={token}>
              <a data-link href={`/record/${token}`}>
                Record: {token}
              </a>
            </li>
          );
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

function Records() {
  return (
    <>
      <h1>Records</h1>
      <h3>Vetted</h3>
      <h3>Public</h3>
      <RecordsList recordsState={"vetted"} status={"public"} />
      <h3>Vetted</h3>
      <h3>Censored</h3>
      <RecordsList recordsState={"vetted"} status={"censored"} />
      <h3>Vetted</h3>
      <h3>Archived</h3>
      <RecordsList recordsState={"vetted"} status={"archived"} />
    </>
  );
}

export default Records;
