import * as external_api from "../lib/external_api";
import act from "./methods";

const CONFIRMATIONS_REQUIRED = 2;

export const getPaymentsByAddress = (address, amount) => dispatch => {
  dispatch(act.REQUEST_VERIFY_PAYWALL_PAYMENT());
  return external_api.getPaymentsByAddress(address)
    .then(response => {
      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT(response));
      const txid = checkForPayment(response, address, amount);
      if (txid) {
        dispatch(act.GET_PAYWALL_TXID({txid}));
        dispatch(act.GRANT_SUBMIT_PROPOSAL_ACCESS({grantAccess: true}));
      }
      else {
        dispatch(act.GRANT_SUBMIT_PROPOSAL_ACCESS({grantAccess: false}));
      }
    })
    .catch(error => {
      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT(null, error));
      throw error;
    });
};

const checkForPayment = (poll, addressToMatch, amount) => {
  let txid;
  poll.forEach((transaction) => {
    txid = checkTransaction(transaction, addressToMatch, amount);
  });
  return txid;
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
      return transaction["txid"];
    }
  }

  return false;
};
