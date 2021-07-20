import React from "react";
import { useRecordsInventory } from "../hooks/useRecordsInventory";
import RecordsList from "./RecordsList";

function Records({ state, status }) {
  const {isLoading, isIdle, data, fetchNextPage, hasNextPage} = useRecordsInventory({state, status});
  const allRecords = data?.pages.flatMap(page => page[state][status] ? page[state][status] : []);
  return isIdle ? null : isLoading ? "Loading..." : (
    <div>
      <h1>Hey, I am {state} records</h1>
      <RecordsList inventoryHasMore={hasNextPage} state={state} status={status} fetchInventoryNextPage={fetchNextPage} records={allRecords} />
    </div>
  );
};

export default Records;