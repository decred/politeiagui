import { records } from "@politeiagui/core/records";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import { selectIsVoteInventoryListEmpty } from "../../pi/proposalsList/selectors";

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
