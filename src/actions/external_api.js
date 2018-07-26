import * as external_api from "../lib/external_api";
import { verifyUserPaymentWithPoliteia } from "./api";
import act from "./methods";
import { PAYWALL_STATUS_LACKING_CONFIRMATIONS, PAYWALL_STATUS_PAID, PAYWALL_STATUS_WAITING_CONFIRMATION } from "../constants";

const CONFIRMATIONS_REQUIRED = 2;

export const verifyUserPayment = (address, amount, txNotBefore) => {
  return async (dispatch, getState) => {
    const state = getState();
    let paymentsResp, txnResp, verifyResp;
    try {
      // fetch from dcrdata
      paymentsResp = await external_api.getPaymentsByAddressDcrdata(address);
      if (paymentsResp === null) {
        // fetch from insight
        paymentsResp = await external_api.getPaymentsByAddressInsight(address);
        txnResp = checkForPayment(checkInsightHandler, paymentsResp, address, amount, txNotBefore);
      }
      else {
        txnResp = checkForPayment(checkDcrdataHandler, paymentsResp, address, amount, txNotBefore);
      }
      //check if payment was made bit is waiting confirmation
      const pollingInterval =
        state.app.userPaywallStatus === PAYWALL_STATUS_WAITING_CONFIRMATION ?
          2000 : 10000;
      let pollingFlag =
        state.app.userPaywallStatus === PAYWALL_STATUS_WAITING_CONFIRMATION ?
          true : false;
      // check if payment was made but is lacking confirmation
      if (txnResp && state.api.me.response) {
        if (txnResp.confirmations === CONFIRMATIONS_REQUIRED) {
          verifyResp = await verifyUserPaymentWithPoliteia(txnResp.id);
          if (verifyResp) {
            dispatch(act.UPDATE_USER_PAYWALL_STATUS({ status: PAYWALL_STATUS_PAID }));
          }
        } else {
          dispatch(act.UPDATE_USER_PAYWALL_STATUS({
            status: PAYWALL_STATUS_LACKING_CONFIRMATIONS,
            currentNumberOfConfirmations: txnResp.confirmations
          }));
          pollingFlag = true;
        }
      }
      // activate polling if needed
      if (pollingFlag && state.api.me.response && !state.app.userAlreadyPaid) {
        setTimeout(() => dispatch(verifyUserPayment(address, amount, txNotBefore)), pollingInterval);
      }
    } catch (e) {
      throw e;
    }
  };
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

export const payWithFaucet = (address, amount, txNotBefore) => {
  return async (dispatch) => {
    dispatch(act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET());
    try {
      const resp = await external_api.payWithFaucet(address, amount);
      if (resp.Error) {
        throw new Error(resp.Error);
      }
      dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET(resp));
      dispatch(act.UPDATE_USER_PAYWALL_STATUS({ status: PAYWALL_STATUS_WAITING_CONFIRMATION }));
      dispatch(verifyUserPayment(address, amount, txNotBefore));
    } catch (err) {
      dispatch(act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET(null, err));
    }
  };
};

export const payProposalWithFaucet = (address, amount) => dispatch => {
  dispatch(act.REQUEST_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET());
  return external_api.payWithFaucet(address, amount)
    .then(json => {
      if(json.Error) {
        return dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET(null, new Error(json.Error)));
      }
      return dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET(json));
    })
    .catch(error => {
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET(null, error));
      throw error;
    });
};

export const getLastBlockHeight = () => dispatch => {
  dispatch(act.REQUEST_GET_LAST_BLOCK_HEIGHT());
  // try with dcrData if fail we try with insight api
  external_api.getHeightByDcrdata().then(response => {
    dispatch(act.RECEIVE_GET_LAST_BLOCK_HEIGHT(response));
  }).catch(err=> {
    // ToDo try with insight
    console.log(err);
  });
};
