import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Error as ErrorView,
  ProposalsList,
  ProposalsListEmpty,
} from "../../components";
import useProposalsList from "../../pi/hooks/useProposalsList";
import useVoteInventory from "../../pi/hooks/useVoteInventory";
import {
  selectHomeError,
  selectIsMultiVoteInventoryListEmpty,
} from "./selectors";

function StatusList({ status, onFetchNextStatus }) {
  const { inventory, inventoryStatus } = useVoteInventory({ status });
  const { onFetchNextBatch, onFetchNextInventoryPage, listFetchStatus } =
    useProposalsList({ status });

  return (
    <ProposalsList
      inventory={inventory}
      inventoryFetchStatus={inventoryStatus}
      onFetchNextBatch={onFetchNextBatch}
      onFetchNextInventoryPage={onFetchNextInventoryPage}
      onFetchDone={onFetchNextStatus}
      listFetchStatus={listFetchStatus}
    />
  );
}

function HomeProposals({ statuses, listName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isEmpty = useSelector((state) =>
    selectIsMultiVoteInventoryListEmpty(state, statuses)
  );
  const error = useSelector(selectHomeError);

  function onFetchNextStatus() {
    const nextIndex = currentIndex + 1;
    if (statuses[nextIndex]) {
      setCurrentIndex(nextIndex);
    }
  }

  return error ? (
    <div data-testid="proposals-list-error">
      <ErrorView error={error} />
    </div>
  ) : isEmpty ? (
    <ProposalsListEmpty listName={listName} />
  ) : (
    statuses
      .slice(0, currentIndex + 1)
      .map((status) => (
        <StatusList
          status={status}
          key={status}
          onFetchNextStatus={onFetchNextStatus}
        />
      ))
  );
}

export default HomeProposals;
