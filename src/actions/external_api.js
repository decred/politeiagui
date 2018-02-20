import * as external_api from "../lib/external_api";
import { verifyUserPayment } from "./api";
import act from "./methods";

const CONFIRMATIONS_REQUIRED = 2;
const TIME_IN_SECONDS = 60;
export const getPaymentsByAddress = (address, amount) => dispatch => {
  dispatch(act.REQUEST_VERIFY_PAYWALL_PAYMENT_EXPLORER());
  return external_api.getPaymentsByAddress(address)
    .then(response => {
      if(response === null) {
        setTimeout(()=> dispatch(getPaymentsByAddress(address, amount)), TIME_IN_SECONDS*1000);
      } else {
        dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT_EXPLORER(response));
        const txid = checkForPayment(response, address, amount);
        if (txid) {
          return verifyUserPayment(dispatch, txid);
        }
        else {
          setTimeout(()=> dispatch(getPaymentsByAddress(address, amount)), TIME_IN_SECONDS*1000);
        }
      }
    })
    .catch(error => {
      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT_EXPLORER(null, error));
      setTimeout(()=> dispatch(getPaymentsByAddress(address, amount)), TIME_IN_SECONDS*1000);
      throw error;
    });
};

const checkForPayment = (poll, addressToMatch, amount) => {
  if (!poll)
    return;
  let txid;
  poll.every((transaction) => {
    txid = checkTransaction(transaction, addressToMatch, amount);
    return !txid;
  });
  return txid;
};

const checkTransaction = (transaction, addressToMatch, amount) => {
  //let addressSeen = false;
  //let addressValue = 0;

  if (transaction.amount >= amount &&
    transaction.confirmations >= CONFIRMATIONS_REQUIRED) {
    return transaction["txid"];
  }

  return false;
  /*
  for (let voutData of transaction["vout"]) {
    const addresses = voutData["scriptPubKey"]["addresses"];
    if (addresses) {
      for(let i=0; i<addresses.length; i++) {
        let address = addresses[i];
        if (address === addressToMatch) {
          addressSeen = true;
          addressValue = voutData["value"];
          break;
        }
      }

      if (addressSeen &&
        addressValue >= amount &&
        transaction["confirmations"] >= CONFIRMATIONS_REQUIRED) {
        return transaction["txid"];
      }
    }
  }

  return false;
  */
};

export const payWithFaucet = (address, amount) => dispatch => {
  dispatch(act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET());
  external_api.payWithFaucet(address, amount)
    .then(dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET({faucetPayment: true})))
    .catch(error => {
      dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET(false, error));
      throw error;
    });
};
