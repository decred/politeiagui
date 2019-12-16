import * as ea from "../external_api";
import * as act from "../types";
import fetchMock from "fetch-mock";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { setPostSuccessResponse, setPostErrorResponse } from "./helpers";

beforeEach(() => {
  //send status 200 to every unmatched request
  fetchMock.restore();
  // fetchMock.get("/", {}).catch({ status: 404 });
});

describe("test actions/external_api", () => {
  // const verifyResponseSuccess =
  const FAKE_ADDRESS = "TsUMTGNMHNqivWpWAbWHvPfoG5GuefF9zWt";
  const FAKE_TRANSACTION =
    "ed4bac11c56cb7a8ceb9dc03278c5abb3ff482e08597e4774e534107c7705f4d";
  const AMOUNT = 0.1;
  const mockStore = configureStore([thunk]);
  const store = mockStore({});

  test("pay with faucet action", async () => {
    const faucetPath = "https://faucet.decred.org/requestfaucet";
    const params = [FAKE_ADDRESS, AMOUNT];

    //test payment succeed
    store.clearActions();
    setPostSuccessResponse(
      faucetPath,
      {},
      { TxId: FAKE_TRANSACTION, Error: "" }
    );
    await store.dispatch(ea.payWithFaucet.apply(null, params));
    expect(store.getActions()).toEqual([
      {
        type: act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET,
        error: false,
        payload: undefined
      },
      {
        type: act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET,
        error: false,
        payload: { TxId: FAKE_TRANSACTION, Error: "" }
      }
    ]);
    //test when payment fails
    store.clearActions();
    setPostErrorResponse(faucetPath, {}, { status: 404 });
    await store.dispatch(ea.payWithFaucet.apply(null, params)).catch((e) => {
      expect(store.getActions()).toEqual([
        {
          type: act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET,
          error: false,
          payload: undefined
        },
        {
          type: act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET,
          error: true,
          payload: e
        }
      ]);
    });
  });
});
