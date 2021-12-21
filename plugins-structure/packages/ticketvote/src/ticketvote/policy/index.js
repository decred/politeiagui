import {
  fetchTicketvotePolicy,
  selectTicketvotePolicy,
  selectTicketvotePolicyRule,
  selectTicketvotePolicyStatus,
} from "./policySlice";

export const ticketvotePolicy = {
  fetch: fetchTicketvotePolicy,
  select: selectTicketvotePolicy,
  selectStatus: selectTicketvotePolicyStatus,
  selectRule: selectTicketvotePolicyRule,
};
