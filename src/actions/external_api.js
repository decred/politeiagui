import * as external_api from "../lib/external_api";
import act from "./methods";

const CONFIRMATIONS_REQUIRED = 2;

export const getPaymentsByAddress = (address, amount) => dispatch => {
  dispatch(act.REQUEST_VERIFY_PAYWALL_PAYMENT());
  return external_api.getPaymentsByAddress(address)
    .then(response => {
      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT(response));
      checkForPayment(response, address, amount);      
    })
    .catch(error => {
      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT(null, error));
      throw error;
    });
};

const checkForPayment = (poll, addressToMatch, amount) => {
  poll.forEach((transaction) => {
    checkTransaction(transaction, addressToMatch, amount);
  });
};

const checkTransaction = (transaction, addressToMatch, amount) => {
  let addressSeen = false;
  let addressValue = 0;
  for (let voutData of transaction["vout"]) {
    const addresses = voutData["scriptPubKey"]["addresses"];
    addresses.forEach(address => {
      if (address === addressToMatch) {
        addressSeen = true;
        addressValue = voutData["value"];
        return;
      }
    });

    if (addressSeen &&
      addressValue >= amount &&
      transaction["confirmations"] >= CONFIRMATIONS_REQUIRED) {
      return true;
    }
  }

  return false;
};
