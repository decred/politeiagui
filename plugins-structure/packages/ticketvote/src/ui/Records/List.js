import React, { useState } from "react";
import { Card } from "pi-ui";
import { useDispatch, useSelector } from "react-redux";
import { ticketvoteInventory } from "../../ticketvote/inventory";
import { ticketvoteSummaries } from "../../ticketvote/summaries";
import { records } from "@politeiagui/core/records";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import { TicketvoteRecordVoteStatusBar } from "../Vote";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvotePolicy } from "../../ticketvote/policy";

export function TicketvoteRecordsList({ status }) {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { inventory, inventoryStatus } = ticketvoteInventory.useFetch({
    status,
    page
  });

  const { summaries, onFetchSummaries } = ticketvoteSummaries.useFetch({
    tokens: inventory
  });

  const { policy, policyStatus } = recordsPolicy.useFetch();
  const { policy: tktvotePolicy, policyStatus: tktvotePolicyStatus } =
    ticketvotePolicy.useFetch();

  const recordsFetched = useSelector((state) =>
    records.selectByTokensBatch(state, inventory)
  );
  const recordsObject = useSelector(records.selectAll);

  function handleFetchNextPage() {
    if (
      policyStatus === "succeeded" &&
      tktvotePolicyStatus === "succeeded" &&
      inventory.length !== 0
    ) {
      const recordsToFetch = getTokensToFetch({
        inventoryList: inventory,
        lookupTable: recordsObject,
        pageSize: policy.recordspagesize
      });
      const voteSummariesToFetch = getTokensToFetch({
        inventoryList: inventory,
        lookupTable: summaries,
        pageSize: tktvotePolicy.summariespagesize
      });
      dispatch(records.fetch({ tokens: recordsToFetch }));
      onFetchSummaries(voteSummariesToFetch);
    }
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
      <button onClick={() => handleFetchNextPage()}>Fetch Next Batch</button>
    </div>
  );
}
