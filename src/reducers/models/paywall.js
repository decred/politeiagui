import * as act from "src/actions/types";
import { update } from "lodash/fp";
import { PAYWALL_STATUS_PAID } from "src/constants";

const DEFAULT_STATE = {
  byUserID: {}
};

const paywall = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_ME || act.RECEIVE_LOGIN]: () => {
            const { userid, paywalladdress } = action.payload;

            return update(["byUserID", userid], (paywall) => ({
              ...paywall,
              isPaid: paywalladdress === ""
            }))(state);
          },
          [act.RECEIVE_PROPOSAL_PAYWALL_DETAILS]: () => {
            const userid = action.payload.userid;
            delete action.payload.userid;

            return update(["byUserID", userid], (paywall) => ({
              ...paywall,
              ...action.payload
            }))(state);
          },
          [act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT]: () => {
            const userid = action.payload.userid;
            delete action.payload.userid;

            return update(["byUserID", userid], (paywall) => ({
              ...paywall,
              ...action.payload
            }))(state);
          },
          [act.UPDATE_USER_PAYWALL_STATUS]: () => {
            const { userid, status } = action.payload;

            return update(["byUserID", userid], (paywall) => ({
              ...paywall,
              status: status,
              isPaid: status === PAYWALL_STATUS_PAID
            }))(state);
          },
          [act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET]: () => {
            const { userid, txid } = action.payload;

            return update(["byUserID", userid], (paywall) => ({
              ...paywall,
              faucetTxid: txid
            }))(state);
          }
        }[action.type] || (() => state)
      )();

export default paywall;
