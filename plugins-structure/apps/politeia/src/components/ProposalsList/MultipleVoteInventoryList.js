import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProposalsVoteInventoryList from "./VoteInventoryList";
import ProposalsListEmpty from "./EmptyList";
import { selectIsMultiVoteInventoryListEmpty } from "../../pi/proposalsList/selectors";

function ProposalListMultipleVoteInventory({ statuses, listName }) {
  const [statusIndex, setStatusIndex] = useState(0);

  const statusesToRender = statuses.slice(0, statusIndex + 1);

  function handleRenderNextStatus() {
    if (statusIndex > statuses.length - 1) {
      return;
    }
    setStatusIndex(statusIndex + 1);
  }

  const isListEmpty = useSelector((state) =>
    selectIsMultiVoteInventoryListEmpty(state, statuses)
  );

  return isListEmpty ? (
    <ProposalsListEmpty listName={listName} />
  ) : (
    statusesToRender.map((status, key) => (
      <ul key={key} data-testid="multiple-statuses-list">
        <ProposalsVoteInventoryList
          status={status}
          onRenderNextStatus={
            key === statusesToRender.length - 1 ? handleRenderNextStatus : null
          }
        />
      </ul>
    ))
  );
}

export default ProposalListMultipleVoteInventory;
