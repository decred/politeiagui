import * as external_api from "../lib/external_api";
import { verifyUserPaymentWithPoliteia } from "./api";
import act from "./methods";
import { PAYWALL_STATUS_LACKING_CONFIRMATIONS, PAYWALL_STATUS_PAID } from "../constants";

const CONFIRMATIONS_REQUIRED = 2;
const POLL_INTERVAL = 10 * 1000;
export const verifyUserPayment = (address, amount, txNotBefore) => dispatch => {
  // Check dcrdata first.
  return external_api.getPaymentsByAddressDcrdata(address)
    .then(response => {
      console.log("dcrdata response: " + response);
      if(response === null) {
        return null;
      }

      return checkForPayment(checkDcrdataHandler, response, address, amount, txNotBefore);
    })
    .then(txn => {
      console.log("dcrdata txn: " + txn);
      if(txn) {
        return txn;
      }

      // If that fails, then try insight.
      return external_api.getPaymentsByAddressInsight(address)
        .then(response => {
          console.log("insight response: " + response);
          if(response === null) {
            return null;
          }

          return checkForPayment(checkInsightHandler, response, address, amount, txNotBefore);
        });
    })
    .then(txn => {
      console.log("insight txn: " + txn);
      if (!txn) {
        return false;
      }

      if(txn.confirmations < CONFIRMATIONS_REQUIRED) {
        dispatch(act.UPDATE_USER_PAYWALL_STATUS({
          status: PAYWALL_STATUS_LACKING_CONFIRMATIONS,
          currentNumberOfConfirmations: txn.confirmations
        }));
        return false;
      }

      return verifyUserPaymentWithPoliteia(dispatch, txn.id);
    })
    .then(verified => {
      if(verified) {
        dispatch(act.UPDATE_USER_PAYWALL_STATUS({ status: PAYWALL_STATUS_PAID }));
      }
      else {
        setTimeout(() => dispatch(verifyUserPayment(address, amount, txNotBefore)), POLL_INTERVAL);
      }
    })
    .catch(error => {
      setTimeout(() => dispatch(verifyUserPayment(address, amount, txNotBefore)), POLL_INTERVAL);
      throw error;
    });
};

const checkForPayment = (handler, transactions, addressToMatch, amount, txNotBefore) => {
  for(let transaction of transactions) {
    let txn = handler(transaction, addressToMatch, amount, txNotBefore);
    if(txn) {
      return txn;
    }
  }
};

const checkDcrdataHandler = (transaction, addressToMatch, amount, txNotBefore) => {
  if (!transaction.vout) {
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
        return {
          id: transaction.txid,
          confirmations: transaction.confirmations
        };
      }
    }
  }

  return null;
};

const checkInsightHandler = (transaction, addressToMatch, amount, txNotBefore) => {
  if (transaction.amount >= amount && transaction.ts >= txNotBefore) {
    return {
      id: transaction.txid,
      confirmations: transaction.confirmations
    };
  }

  return null;
};

export const payWithFaucet = (address, amount) => dispatch => {
  dispatch(act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET());
  external_api.payWithFaucet(address, amount)
    .then(() => dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET({faucetPayment: true})))
    .catch(error => {
      dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET(false, error));
      throw error;
    });
};
