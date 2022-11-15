import React from "react";
import {
  ProposalListEmpty,
  ProposalListMultipleVoteInventory,
} from "../../../components";
import { useSelector } from "react-redux";
import { selectHomeStatus, selectIsMultiStatusListEmpty } from "../selectors";

function UnderReviewPage() {
  const statuses = ["started", "authorized", "unauthorized"];
  const isListEmpty = useSelector((state) =>
    selectIsMultiStatusListEmpty(state, statuses)
  );
  const listFetchStatus = useSelector(selectHomeStatus);
  return isListEmpty ? (
    <ProposalListEmpty status="under review" />
  ) : (
    <div data-testid="proposals-under-review-list">
      <ProposalListMultipleVoteInventory
        statuses={statuses}
        listFetchStatus={listFetchStatus}
      />
    </div>
  );
}

export default UnderReviewPage;
