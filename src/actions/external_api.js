import * as external_api from "../lib/external_api";
import act from "./methods";

export const payWithFaucet = (address, amount, userid) => (dispatch) => {
  dispatch(act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET());
  return external_api
    .payWithFaucet(address, amount)
    .then((json) => {
      if (json.error) {
        const error = new Error(json.error);
        dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET(null, error));
        throw error;
      }
      return dispatch(
        act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET({ ...json, userid })
      );
    })
    .catch((error) => {
      dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET(null, error));
      throw error;
    });
};

export const resetPaywallPaymentWithFaucet = () =>
  act.RESET_PAYWALL_PAYMENT_WITH_FAUCET();
