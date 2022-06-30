import React from "react";
import MultipleStatusesRecordsList from "../common/MultipleStatusesRecordsList";
import EmptyMessage from "../common/EmptyList";
import { useSelector } from "react-redux";
import { selectIsMultiStatusListEmpty } from "../selectors";

function UnderReviewPage() {
  const statuses = ["started", "authorized", "unauthorized"];
  const isListEmpty = useSelector((state) =>
    selectIsMultiStatusListEmpty(state, statuses)
  );
  return isListEmpty ? (
    <EmptyMessage status="under review" />
  ) : (
    <div data-testid="proposals-under-review-list">
      <MultipleStatusesRecordsList statuses={statuses} />
    </div>
  );
}

export default UnderReviewPage;
