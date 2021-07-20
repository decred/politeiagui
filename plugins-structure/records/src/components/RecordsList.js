import React, { useEffect } from "react";
import { useRecords } from "../hooks/useRecords";

function RecordsList({ fetchInventoryNextPage, inventoryHasMore, state, status, records = [], setListAsFinished, enabled = true, finished } = {}) {
  const recordsInfo = useRecords({state, status, records, enabled });
  /* useEffect to verify if we are finished fetching */
  useEffect(() => {
    /* Here we have to verify is hasNextPage is Boolean and equals to false. If we only check if hasNextPage is falsy, it will enter the if in the first render when it is undefined */
    if (recordsInfo.hasNextPage === false && !inventoryHasMore && setListAsFinished) {
      if (!finished) setListAsFinished();
    }
  });

  /* useEffect to control wheter we should fetch next inventory page */
  useEffect(() => {
    /** Verify if hasNextPage is Boolean and equals to false for the same reason as above  */
    if (recordsInfo.hasNextPage === false && inventoryHasMore) {
      fetchInventoryNextPage();
    }
  }, [recordsInfo.hasNextPage, inventoryHasMore])

  return recordsInfo.isIdle ? null : recordsInfo.isLoading ? "Loading..." : (
    <div>
      <ul>
      {recordsInfo.data.pages.map((page, index) => (
        <React.Fragment key={index}>
          {Object.values(page.records).map(record => (
            <li key={record.censorshiprecord.token}>
              {record.censorshiprecord.token}
            </li>
          ))}
        </React.Fragment>
      ))}
      </ul>
      <button disabled={!recordsInfo.hasNextPage && !inventoryHasMore} onClick={() => recordsInfo.fetchNextPage()}>Load More</button>
    </div>
  );
}

export default RecordsList;