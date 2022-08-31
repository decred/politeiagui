import {
  fetchTicketvotePolicy,
  selectTicketvotePolicy,
  selectTicketvotePolicyError,
  selectTicketvotePolicyRule,
  selectTicketvotePolicyStatus,
} from "./policySlice";

export const ticketvotePolicy = {
  fetch: fetchTicketvotePolicy,
  select: selectTicketvotePolicy,
  selectStatus: selectTicketvotePolicyStatus,
  selectError: selectTicketvotePolicyError,
  selectRule: selectTicketvotePolicyRule,
};
