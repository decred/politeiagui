import React, { useState, lazy, Suspense } from "react";
import { useVoteInventory } from "../hooks/useVoteInventory";
const RecordsList = lazy(() => import("records/RecordsList"));

function VoteStatusList({ status, setListAsFinished, enabled, finished }) {
  const {isLoading, isIdle, data, fetchNextPage, hasNextPage} = useVoteInventory({ status, enabled });
  const allRecords = data?.pages.flatMap(page => page.vetted[status] ? page.vetted[status] : []);
  return isIdle ? null : isLoading ? "Loading..." : (
    <Suspense fallback={<div>Loading...</div>}>
      <RecordsList inventoryHasMore={hasNextPage} state={"vetted"} status={status} fetchInventoryNextPage={fetchNextPage} records={allRecords} enabled={enabled} finished={finished} setListAsFinished={setListAsFinished} />
    </Suspense>
  );
};

/**
 * Here we want to build n lists in order but only start
 * building the next list when the previous one is done.
 * I decided to go with this approach because it allows
 * a lot of code reuse. Another alternative is to control
 * the inventory fetch for each status and use RecordsList
 * with a custom status.
 */
function VoteStatusesList({ statuses }) {
  const [fetchEnabled, setFetchEnabled] = useState(statuses.map((_, i) => i === 0));
  const [finished, setFinished] = useState(statuses.map(() => false));
  const setListAsFinished = (currIndex) => () => {
    const newFinished = [...finished];
    newFinished[currIndex] = true;
    setFinished(newFinished);
    // all lists are done
    if (currIndex === fetchEnabled.length - 1) return;
    // set next index as enabled
    else {
      const newArr = [...fetchEnabled];
      newArr[currIndex + 1] = true;
      setFetchEnabled(newArr);
    }
  }
  return statuses.map((status, i) => <VoteStatusList key={status} status={status} enabled={fetchEnabled[i]} setListAsFinished={setListAsFinished(i)} finished={finished[i]} />)
};

export function Approved() {
  return (
    <div>
      <h1>Approved records</h1>
      <VoteStatusList status="approved" />
    </div>
  )
}

export function Rejected() {
  return (
    <div>
      <h1>Rejected records</h1>
      <VoteStatusList status="rejected" />
    </div>
  )
}

export function Abandoned() {
  return (
    <div>
      <h1>Ineligible records</h1>
      <VoteStatusList status="ineligible" />
    </div>
  )
}

export function UnderReview() {
  return (
    <div>
      <h1>Under review records</h1>
      <VoteStatusesList statuses={["started", "authorized", "unauthorized"]}/>
    </div>
  )
}