import * as external_api from "../lib/external_api";
import act from "./methods";

export const getPaymentsByAddress = () => dispatch => {
  dispatch(act.REQUEST_VERIFY_PAYWALL_PAYMENT());
  return external_api.getPaymentsByAddress("TsRBnD2mnZX1upPMFNoQ1ckYr9Y4TZyuGTV")
    .then(response => {
      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT(response));
    })
    .catch(error => {
      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT(null, error));
      throw error;
    });
};
