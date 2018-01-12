import * as external_api from "../lib/external_api";
import act from "./methods";

const CONFIRMATIONS_REQUIRED = 2;
const TIME_IN_SECONDS = 60;
export const getPaymentsByAddress = (address, amount) => dispatch => {
  dispatch(act.REQUEST_VERIFY_PAYWALL_PAYMENT());
  return external_api.getPaymentsByAddress(address)
    .then(response => {
      if(response === null) {
        dispatch(act.GRANT_SUBMIT_PROPOSAL_ACCESS(false));
        setTimeout(()=> dispatch(getPaymentsByAddress(address, amount)), TIME_IN_SECONDS*1000);
      } else {
        dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT(response));
        const txid = checkForPayment(response, address, amount);
        if (txid) {
          dispatch(act.GET_PAYWALL_TXID({txid}));
          dispatch(act.GRANT_SUBMIT_PROPOSAL_ACCESS(true));
          return;
        }
        else {
          dispatch(act.GRANT_SUBMIT_PROPOSAL_ACCESS(false));
          setTimeout(()=> dispatch(getPaymentsByAddress(address, amount)), TIME_IN_SECONDS*1000);
        }
      }
    })
    .catch(error => {
      dispatch(act.GRANT_SUBMIT_PROPOSAL_ACCESS(false));
      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT(null, error));
      setTimeout(()=> dispatch(getPaymentsByAddress(address, amount)), TIME_IN_SECONDS*1000);
      throw error;
    });
};

const checkForPayment = (poll, addressToMatch, amount) => {
  if (!poll)
    return;
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
    if (addresses) {
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
  }

  return false;
};
