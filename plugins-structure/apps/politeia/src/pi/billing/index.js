import {
  fetchBillingStatusChanges,
  selectPiBillingStatus,
  selectPiBillingStatusChanges,
  selectPiBillingStatusChangesByToken,
} from "./billingSlice";

export const piBilling = {
  fetch: fetchBillingStatusChanges,
  selectStatus: selectPiBillingStatus,
  selectAll: selectPiBillingStatusChanges,
  selectByToken: selectPiBillingStatusChangesByToken,
};
