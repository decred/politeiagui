import React from "react";
import MultipleStatusesRecordsList from "../common/MultipleStatusesRecordsList";
import EmptyMessage from "../common/EmptyList";
import { useSelector } from "react-redux";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import isEmpty from "lodash/fp/isEmpty";

function isStatusDone(status) {
  return status === "succeeded/isDone";
}

function UnderReviewPage() {
  const statuses = ["started", "authorized", "unauthorized"];
  const allTokens = useSelector((state) => [
    ticketvoteInventory.selectByStatus(state, "started"),
    ticketvoteInventory.selectByStatus(state, "authorized"),
    ticketvoteInventory.selectByStatus(state, "unauthorized"),
  ]);
  const allStatuses = useSelector((state) => [
    ticketvoteInventory.selectStatus(state, { status: "authorized" }),
    ticketvoteInventory.selectStatus(state, { status: "started" }),
    ticketvoteInventory.selectStatus(state, { status: "unauthorized" }),
  ]);
  const isListEmpty =
    allStatuses.every(isStatusDone) && allTokens.every(isEmpty);

  return isListEmpty ? (
    <EmptyMessage status="under review" />
  ) : (
    <MultipleStatusesRecordsList statuses={statuses} />
  );
}

export default UnderReviewPage;
