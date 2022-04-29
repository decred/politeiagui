import {
  fetchPiPolicy,
  selectPiPolicy,
  selectPiPolicyStatus,
} from "./policySlice";

export const piPolicy = {
  fetch: fetchPiPolicy,
  selectAll: selectPiPolicy,
  selectStatus: selectPiPolicyStatus,
};
