import { records } from "@politeiagui/core/records";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import isEmpty from "lodash/isEmpty";

export function selectIsVoteInventoryListEmpty(state, status) {
  const tokens = ticketvoteInventory.selectByStatus(state, status);
  const fetchStatus = ticketvoteInventory.selectStatus(state, { status });
  return isEmpty(tokens) && fetchStatus === "succeeded/isDone";
}

export function selectIsMultiVoteInventoryListEmpty(state, statuses) {
  return statuses.every((status) =>
    selectIsVoteInventoryListEmpty(state, status)
  );
}

export function selectHomeError(state) {
  const inv = ticketvoteInventory.selectError(state);
  const recs = records.selectError(state);
  const error = [inv, recs].find((e) => !!e);
  return error;
}
