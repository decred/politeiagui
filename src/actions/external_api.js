import * as external_api from "../lib/external_api";
import { verifyUserPaymentWithPoliteia } from "./api";
import act from "./methods";

const CONFIRMATIONS_REQUIRED = 2;
const POLL_INTERVAL = 60 * 1000;
export const verifyUserPayment = (address, amount, txNotBefore) => dispatch => {
  dispatch(act.REQUEST_VERIFY_PAYWALL_PAYMENT_EXPLORER());

  // Check dcrdata first.
  return external_api.getPaymentsByAddressDcrdata(address)
    .then(response => {
      if(response === null) {
        return null;
      }

      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT_EXPLORER(response));
      return checkForPayment(checkDcrdataHandler, response, address, amount, txNotBefore);
    })
    .then(txid => {
      if(txid) {
        return txid;
      }

      // If that fails, then try insight.
      return external_api.getPaymentsByAddressInsight(address)
        .then(response => {
          if(response === null) {
            return null;
          }

          dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT_EXPLORER(response));
          return checkForPayment(checkInsightHandler, response, address, amount, txNotBefore);
        });
    })
    .then(txid => {
      if (!txid) {
        return false;
      }

      return verifyUserPaymentWithPoliteia(dispatch, txid);
    })
    .then(verified => {
      if(!verified) {
        setTimeout(() => dispatch(verifyUserPayment(address, amount, txNotBefore)), POLL_INTERVAL);
      }
    })
    .catch(error => {
      dispatch(act.RECEIVE_VERIFY_PAYWALL_PAYMENT_EXPLORER(null, error));
      setTimeout(() => dispatch(verifyUserPayment(address, amount, txNotBefore)), POLL_INTERVAL);
      throw error;
    });
};

const checkForPayment = (handler, transactions, addressToMatch, amount, txNotBefore) => {
  for(let transaction of transactions) {
    let txid = handler(transaction, addressToMatch, amount, txNotBefore);
    if(txid) {
      return txid;
    }
  }
};

const checkDcrdataHandler = (transaction, addressToMatch, amount, txNotBefore) => {
  if (!transaction.vout) {
    return null;
  }
  if (transaction.confirmations < CONFIRMATIONS_REQUIRED) {
    return null;
  }
  if (transaction.time < txNotBefore) {
    return null;
  }

  for (let voutData of transaction.vout) {
    const addresses = voutData.scriptPubKey.addresses;
    if (!addresses) {
      continue;
    }

    for (let address of addresses) {
      if (address === addressToMatch && voutData.value >= amount) {
        return transaction.txid;
      }
    }
  }

  return null;
};

const checkInsightHandler = (transaction, addressToMatch, amount, txNotBefore) => {
  if (transaction.confirmations >= CONFIRMATIONS_REQUIRED
    && transaction.amount >= amount
    && transaction.ts >= txNotBefore) {
    return transaction.txid;
  }

  return null;
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
