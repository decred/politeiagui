import external_api from "../external_api";
import * as act from "../../actions/types";
import { testReceiveReducer, testRequestReducer } from "./helpers";

describe("test external_api reducer", () => {

  const MOCK_STATE = {

  };

  test("tests paywall reducers, involving request and receive", () => {

    const request_action = {
      type: act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET,
      payload: "data",
      error: false
    };

    const receive_action = {
      type: act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET,
      payload: "data",
      error: false
    };

    testRequestReducer(external_api, "payWithFaucet", MOCK_STATE, request_action);
    testReceiveReducer(external_api, "payWithFaucet", MOCK_STATE, receive_action);
  });

  test("tests proposal paywall payment reducers, involving request and receive", () => {

    const request_action = {
      type: act.REQUEST_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET,
      payload: "data",
      error: false
    };

    const receive_action = {
      type: act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT_WITH_FAUCET,
      payload: "data",
      error: false
    };

    testRequestReducer(external_api, "payProposalWithFaucet", MOCK_STATE, request_action);
    testReceiveReducer(external_api, "payProposalWithFaucet", MOCK_STATE, receive_action);
  });

  test("tests last block height reducers, involving request and receive", () => {

    const request_action = {
      type: act.REQUEST_GET_LAST_BLOCK_HEIGHT,
      payload: "data",
      error: false
    };

    const receive_action = {
      type: act.RECEIVE_GET_LAST_BLOCK_HEIGHT,
      payload: "data",
      error: false
    };

    testRequestReducer(external_api, "blockHeight", MOCK_STATE, request_action);
    testReceiveReducer(external_api, "blockHeight", MOCK_STATE, receive_action);
  });
});
