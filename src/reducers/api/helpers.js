import get from "lodash/fp/get";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_STATUS_PUBLIC
} from "../../constants";

// updateTokenInventory updates the token inventory by moving the token
// from one category into another. (example: pre -> active or pre -> abandoned)
export const updateTokenInventory = (tokenInventory, newStatus, token) => {
  if (
    !tokenInventory ||
    (newStatus !== PROPOSAL_VOTING_ACTIVE &&
      newStatus !== PROPOSAL_STATUS_PUBLIC &&
      newStatus !== PROPOSAL_STATUS_ABANDONED)
  )
    return tokenInventory;

  const { pre, active, abandoned, ...others } = tokenInventory || {};

  return {
    pre:
      newStatus === PROPOSAL_STATUS_PUBLIC
        ? [...pre, token]
        : pre.filter(t => t !== token),
    active: newStatus === PROPOSAL_VOTING_ACTIVE ? [...active, token] : active,
    abandoned:
      newStatus === PROPOSAL_STATUS_ABANDONED
        ? [...abandoned, token]
        : abandoned,
    ...others
  };
};

export const getTokenInventory = state =>
  get(["tokenInventory", "response"], state);
