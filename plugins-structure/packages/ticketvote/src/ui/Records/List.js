import React, { useState } from "react";
import { Card } from "pi-ui";
import { useSelector } from "react-redux";
import { ticketvoteInventory } from "../../ticketvote/inventory";
import { ticketvoteSummaries } from "../../ticketvote/summaries";
import { records } from "@politeiagui/core/records";
import { TicketvoteRecordVoteStatusBar } from "../Vote";

// TODO: redo without fetchNextRecordsBatch from recordsInventory
export function TicketvoteRecordsList({ status }) {
  const [page, setPage] = useState(1);
  const { inventory, onFetchNextRecordsBatch, inventoryStatus } =
    ticketvoteInventory.useFetch({
      status,
      page,
    });

  const { summaries, onFetchSummariesNextPage } = ticketvoteSummaries.useFetch({
    tokens: inventory,
  });
  const recordsFetched = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );

  function handleFetchNextPage() {
    onFetchNextRecordsBatch();
    onFetchSummariesNextPage();
  }

  return (
    <div>
      {recordsFetched &&
        recordsFetched.map((rec, i) => {
          if (
            i === inventory.length - 1 &&
            inventoryStatus === "succeeded/hasMore"
          )
            return (
              <button onClick={() => setPage(page + 1)}>
                Fetch Next Inventory Page
              </button>
            );
          return (
            <Card key={i} paddingSize="small">
              <div>Record: {rec.censorshiprecord.token}</div>
              <TicketvoteRecordVoteStatusBar
                ticketvoteSummary={summaries[rec.censorshiprecord.token]}
              />
            </Card>
          );
        })}
      <button onClick={handleFetchNextPage}>Fetch Next Batch</button>
    </div>
  );
}
