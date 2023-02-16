import {
  // Thunks
  fetchUserCredits,
  fetchUserPaywall,
  // Credits
  selectUserCredits,
  selectUserCreditsError,
  selectUserCreditsStatus,
  // Paywall
  selectUserPaywall,
  selectUserPaywallError,
  selectUserPaywallStatus,
} from "./userPaymentsSlice";

export const userPayments = {
  // Paywall
  fetchPaywall: fetchUserPaywall,
  selectPaywall: selectUserPaywall,
  selectPaywallError: selectUserPaywallError,
  selectPaywallStatus: selectUserPaywallStatus,
  // Credits
  fetchCredits: fetchUserCredits,
  selectCredits: selectUserCredits,
  selectCreditsError: selectUserCreditsError,
  selectCreditsStatus: selectUserCreditsStatus,
};
