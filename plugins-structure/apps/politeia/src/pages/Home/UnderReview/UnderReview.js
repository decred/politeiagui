import React from "react";
import {
  ProposalsListEmpty,
  ProposalsListMultipleVoteInventory,
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
    <ProposalsListEmpty status="under review" />
  ) : (
    <div data-testid="proposals-under-review-list">
      <ProposalsListMultipleVoteInventory
        statuses={statuses}
        listFetchStatus={listFetchStatus}
      />
    </div>
  );
}

export default UnderReviewPage;
