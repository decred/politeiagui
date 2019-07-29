import * as act from "../actions/types";
import { DEFAULT_REQUEST_STATE, receive, request, reset } from "./util";

export const DEFAULT_STATE = {
  payWithFaucet: DEFAULT_REQUEST_STATE
};

const external_api = (state = DEFAULT_STATE, action) =>
  (({
    [act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET]: () =>
      request("payWithFaucet", state, action),
    [act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET]: () =>
      receive("payWithFaucet", state, action),
    [act.RESET_PAYWALL_PAYMENT_WITH_FAUCET]: () =>
      reset("payWithFaucet", state),
    [act.RECEIVE_LOGOUT]: () => DEFAULT_STATE
  }[action.type] || (() => state))());

export default external_api;
