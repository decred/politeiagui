import {
  fetchTicketvotePolicy,
  selectTicketvotePolicy,
  selectTicketvotePolicyRule,
  selectTicketvotePolicyStatus,
  selectTicketvotePolicyError,
} from "./policySlice";

export const ticketvotePolicy = {
  fetch: fetchTicketvotePolicy,
  select: selectTicketvotePolicy,
  selectStatus: selectTicketvotePolicyStatus,
  selectError: selectTicketvotePolicyError,
  selectRule: selectTicketvotePolicyRule,
};
