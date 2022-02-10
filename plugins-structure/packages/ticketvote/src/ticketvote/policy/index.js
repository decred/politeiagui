import {
  fetchTicketvotePolicy,
  selectTicketvotePolicy,
  selectTicketvotePolicyError,
  selectTicketvotePolicyRule,
  selectTicketvotePolicyStatus,
} from "./policySlice";

import { useTicketvotePolicy } from "./usePolicy";

export const ticketvotePolicy = {
  fetch: fetchTicketvotePolicy,
  select: selectTicketvotePolicy,
  selectStatus: selectTicketvotePolicyStatus,
  selectError: selectTicketvotePolicyError,
  selectRule: selectTicketvotePolicyRule,
  useFetch: useTicketvotePolicy,
};
