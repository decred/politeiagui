import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import { recordsInventory } from "@politeiagui/core/records/inventory";
import { getRfpProposalsLinks, proposalFilenames } from "../proposals/utils";

function getVoteInventoryList({ status }, state) {
  return ticketvoteInventory.selectByStatus(state, status);
}
function getRecordsInventoryList({ status, recordsState }, state) {
  return recordsInventory.selectByStateAndStatus(state, {
    recordsState,
    status,
  });
}

export async function onVoteInventoryFetch(
  effect,
  action,
  { getState, dispatch }
) {
  const state = getState();
  const inventoryList = getVoteInventoryList(action.payload, state);
  await effect(state, dispatch, {
    inventoryList,
    filenames: proposalFilenames,
  });
}

export async function onRfpSubmissionFetch(
  effect,
  { payload },
  { getState, dispatch, unsubscribe, subscribe }
) {
  unsubscribe();
  const state = getState();
  const links = getRfpProposalsLinks(Object.values(payload));
  await effect(state, dispatch, {
    inventoryList: links,
    filenames: proposalFilenames,
  });
  subscribe();
}
