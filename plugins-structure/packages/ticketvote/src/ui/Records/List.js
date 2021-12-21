import React, { useState } from "react";
import {
  TicketvoteInventoryWrapper,
  TicketvoteSummariesWrapper,
} from "../Wrappers";

export function TicketvoteRecordsList({ statuses, children }) {
  const [firstStatus, ...rest] = statuses;
  const [statusesNotFetched, setNotFetched] = useState(rest);
  const [statusesFetched, setFetched] = useState([firstStatus]);

  function fetchNextStatusInventory() {
    const [current, ...newNotFetched] = statusesNotFetched;
    setNotFetched(newNotFetched);
    setFetched([...statusesFetched, current]);
  }

  return statuses.map((status, key) => (
    <div key={key}>
      {!statusesNotFetched.includes(status) && (
        <TicketvoteInventoryWrapper
          status={status}
          onFetchDone={fetchNextStatusInventory}
        >
          {(inventoryProps) => {
            return (
              <TicketvoteSummariesWrapper
                tokens={inventoryProps.inventory}
                status={status}
                initialFetch={true}
                isFetchAllowed={inventoryProps.hasLoaded}
              >
                {(summariesProps) =>
                  children({
                    inventory: inventoryProps,
                    summaries: summariesProps,
                  })
                }
              </TicketvoteSummariesWrapper>
            );
          }}
        </TicketvoteInventoryWrapper>
      )}
    </div>
  ));
}
