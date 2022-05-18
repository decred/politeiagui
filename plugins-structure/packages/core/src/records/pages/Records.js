import React, { useEffect, useState } from "react";
import { recordsInventory } from "../inventory";
import { records } from "../records";
import { useDispatch, useSelector } from "react-redux";
import { listener } from "../../listeners";
import { createAction } from "@reduxjs/toolkit";
import {
  getHumanReadableRecordState,
  getHumanReadableRecordStatus,
  getTokensToFetch,
} from "../utils";

const fetchNextBatch = createAction("records/fetchNextBatch");

listener.startListening({
  actionCreator: fetchNextBatch,
  effect: async ({ payload: { recordsState, status } }, listenerApi) => {
    const readableRecordsState = getHumanReadableRecordState(recordsState);
    const readableStatus = getHumanReadableRecordStatus(status);
    const {
      recordsInventory,
      records: recordsObj,
      recordsPolicy,
    } = listenerApi.getState();
    const pageSize = recordsPolicy.policy.recordspagesize;
    const inventoryList =
      recordsInventory[readableRecordsState][readableStatus].tokens;
    const recordsToFetch = getTokensToFetch({
      inventoryList,
      pageSize,
      lookupTable: recordsObj.records,
    });
    await listenerApi.dispatch(records.fetch({ tokens: recordsToFetch }));
  },
});

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
          return <li key={token}>Record: {token}</li>;
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
