import * as external_api from "../lib/external_api";
import {
  verifyUserPaymentWithPoliteia
} from "./api";
import act from "./methods";
import {
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_PAID
} from "../constants";

const CONFIRMATIONS_REQUIRED = 2;
const POLL_INTERVAL = 10 * 1000;
export const verifyUserPayment = (address, amount, txNotBefore) => dispatch => {
  // Check dcrdata first.
  return external_api.getPaymentsByAddressDcrdata(address)
    .then(response => {
      if (response === null) {
        return null;
      }

      return checkForPayment(checkDcrdataHandler, response, address, amount, txNotBefore);
    })
    .catch(() => {
      // Failed to fetch from dcrdata.
      return null;
    })
    .then(txn => {
      if (txn) {
        return txn;
      }

      // If that fails, then try insight.
      return external_api.getPaymentsByAddressInsight(address)
        .then(response => {
          if (response === null) {
            return null;
          }

          return checkForPayment(checkInsightHandler, response, address, amount, txNotBefore);
        });
    })
    .then(txn => {
      if (!txn) {
        return false;
      }

      if (txn.confirmations < CONFIRMATIONS_REQUIRED) {
        dispatch(act.UPDATE_USER_PAYWALL_STATUS({
          status: PAYWALL_STATUS_LACKING_CONFIRMATIONS,
          currentNumberOfConfirmations: txn.confirmations
        }));
        return false;
      }

      return verifyUserPaymentWithPoliteia(txn.id);
    })
    .then(verified => {
      if (verified) {
        dispatch(act.UPDATE_USER_PAYWALL_STATUS({
          status: PAYWALL_STATUS_PAID
        }));
      } else {
        setTimeout(() => dispatch(verifyUserPayment(address, amount, txNotBefore)), POLL_INTERVAL);
      }
    })
    .catch(error => {
      setTimeout(() => dispatch(verifyUserPayment(address, amount, txNotBefore)), POLL_INTERVAL);
      throw error;
    });
};

const checkForPayment = (handler, transactions, addressToMatch, amount, txNotBefore) => {
  for (const transaction of transactions) {
    const txn = handler(transaction, addressToMatch, amount, txNotBefore);
    if (txn) {
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

  for (const voutData of transaction.vout) {
    const addresses = voutData.scriptPubKey.addresses;
    if (!addresses) {
      continue;
    }

    for (const address of addresses) {
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
  return external_api.payWithFaucet(address, amount)
    .then(json => {
      if (json.Error) {
        return dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET(null, new Error(json.Error)));
      }
      return dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET(json));
    })
    .catch(error => {
      dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET(null, error));
      throw error;
    });
};

export const payProposalWithFaucet = (address, amount) => dispatch => {
  dispatch(act.REQUEST_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET());
  return external_api.payWithFaucet(address, amount)
    .then(json => {
      if (json.Error) {
        return dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET(null, new Error(json.Error)));
      }
      return dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET(json));
    })
    .catch(error => {
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET(null, error));
      throw error;
    });
};

export const getLastBlockHeight = () => (dispatch) => {
  dispatch(act.REQUEST_GET_LAST_BLOCK_HEIGHT());
  // try with dcrData if fail we try with insight api
  external_api.getHeightByDcrdata().then(response => {
    return dispatch(act.RECEIVE_GET_LAST_BLOCK_HEIGHT(response));
  }).catch(err => {
    // ToDo try with insight
    console.log(err);
  });
};
