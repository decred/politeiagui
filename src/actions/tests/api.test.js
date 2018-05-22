import fetchMock from "fetch-mock";
import configureStore from "redux-mock-store";
import qs from "query-string";
import thunk from "redux-thunk";
import * as api from "../api";
import * as ea  from "../external_api";
import * as act from "../types";
import { done } from "./helpers";

const mockStore = configureStore([thunk]);

describe("test api actions (actions/api.js)", () => {
  const FAKE_PAYWALL = {
    address: "T_fake_address",
    amount: 10,
    txNotBefore: "any"
  };
  const FAKE_CSRF = "fake_csrf_token";
  const FAKE_USER = {
    id: "2",
    email: "foo@bar.com",
    username: "foobar",
    password: "foobar1234"
  };
  const MOCK_STATE = {
    api: {
      me: {
        response: {
          paywalladdress: FAKE_PAYWALL.address,
          paywallamount: FAKE_PAYWALL.amount,
          paywalltxnotbefore: FAKE_PAYWALL.txNotBefore,
          csrfToken: FAKE_CSRF
        }
      }
    }
  };

  const RANDOM_SUCCESS_RESPONSE = {
    success: true
  };
  const RANDOM_ERROR_RESPOSNE = {
    errorcode: 29
  };
  const setGetSuccessResponse = (path, response = RANDOM_SUCCESS_RESPONSE) =>
    fetchMock.get(path, response, {
      overwriteRoutes: true
    });
  const setGetErrorResponse = (path, response = RANDOM_ERROR_RESPOSNE) =>
    fetchMock.get(path, response, {
      overwriteRoutes: true
    });
  const setPostSuccessResponse = (path, response = RANDOM_SUCCESS_RESPONSE) =>
    fetchMock.post(path, response, {
      overwriteRoutes: true
    });
  const setPostErrorResponse = (path, response = RANDOM_ERROR_RESPOSNE) =>
    fetchMock.post(path, response, {
      overwriteRoutes: true
    });
  const methods = {
    GET: "get",
    POST: "post"
  };
  const assertApiActionOnSuccess = async (path, fn, params, expectedActions, method = methods.GET) => {
    switch(method) {
    case methods.GET:
      setGetSuccessResponse(path);
      break;
    case methods.POST:
      setPostSuccessResponse(path);
      break;
    default:
      setGetSuccessResponse(path);
    }
    await expect(fn.apply(null, params))
      .toDispatchActionsWithState(MOCK_STATE, expectedActions, done);
  };
  const assertApiActionOnError = async (path, fn, params, callbackWithError, method = methods.GET) => {
    switch(method) {
    case methods.GET:
      setGetErrorResponse(path);
      break;
    case methods.POST:
      setPostErrorResponse(path);
      break;
    default:
      setGetErrorResponse(path);
    }
    const store = getMockedStore();
    await store.dispatch(fn.apply(null, params)).catch(e => {
      const expectedActions = callbackWithError(e);
      expect(store.getActions()).toEqual(expectedActions);
    });
  };

  const getMockedStore = () => mockStore(MOCK_STATE);

  beforeEach(() => {
    //send status 200 to every unmatched request
    fetchMock.restore();
    fetchMock.post("/", {}).catch({});
  });

  test("request api info action", async () => {
    const path = "/api/";
    const poolPaywall = true;
    const { address, amount, txNotBefore } = FAKE_PAYWALL;
    fetchMock.restore();

    //test it handles a success response
    setGetSuccessResponse(path);
    // test without pooling paywall flag
    await expect(api.requestApiInfo())
      .toDispatchActionsWithState(MOCK_STATE, [
        { type: act.RECEIVE_INIT_SESSION, error: false, payload: { csrfToken : "itsafake" } }
      ], done);

    // test it does pool paywall and dispatch actions
    // define specific mocks for external apis to return responses as an array
    setGetSuccessResponse(`https://testnet.dcrdata.org/api/address/${address}/raw`, []);
    setGetSuccessResponse(`https://testnet.decred.org/api/addr/${address}/utxo?noCache=1`, []);
    await expect(api.requestApiInfo(poolPaywall))
      .toDispatchActionsWithState(MOCK_STATE, [
        { type: act.RECEIVE_INIT_SESSION, payload: { csrfToken : "itsafake" } },
        ea.verifyUserPayment(address, amount, txNotBefore)
      ], done);

    // test it handles an error and dispatch an action
    const store = mockStore(MOCK_STATE);
    setGetErrorResponse(path);
    localStorage.setItem("state", "any");
    await store.dispatch(api.requestApiInfo())
      .catch((e) => {
        expect(store.getActions()).toEqual([
          { type: act.RECEIVE_INIT_SESSION, error: true, payload: e },
        ]);
      });

  });

  test("on init action", async () => {
    const successfullResponse = { ...FAKE_USER };
    const path = "/api/v1/user/me";
    fetchMock.get("/api/v1/user/me", successfullResponse);

    // test it successfully handles the response and dispatch actions
    setGetSuccessResponse(path, successfullResponse);
    await expect(api.onInit())
      .toDispatchActions([
        { type: act.REQUEST_ME },
        { type: act.RECEIVE_ME,
          payload: { email: FAKE_USER.email, username: FAKE_USER.username, csrfToken : "itsafake" }
        },
        { type: act.REQUEST_INIT_SESSION },
        api.requestApiInfo(true)
      ], done);

    //test it successfully handles the error response
    //test localstorage was cleaned up
    const store = getMockedStore();
    setGetErrorResponse(path);
    localStorage.setItem("state", "any");
    expect(localStorage.getItem("state")).toBeTruthy();
    await store.dispatch(api.onInit())
      .catch(() => {
        expect(store.getActions()).toBeEqual([
          { type: act.REQUEST_INIT_SESSION },
          api.requestApiInfo()
        ]);
        expect(localStorage.getItem("state")).toBeFalsy();
      });
  });

  test("update me action", () => {
    const payload = "any";
    expect(api.updateMe(payload))
      .toDispatchActions(
        { type: act.UPDATE_ME, payload },
        done
      );
  });

  test("on route change action", () => {
    expect(api.onRouteChange())
      .toDispatchActions(
        { type: act.CLEAN_ERRORS },
        done
      );
  });

  test("on get policy action", async () => {
    const path = "/api/v1/policy";
    //test it handles a successfull response
    await assertApiActionOnSuccess(
      path,
      api.onGetPolicy,
      [],
      [
        { type: act.REQUEST_POLICY },
        { type: act.RECEIVE_POLICY, error: false, payload: RANDOM_SUCCESS_RESPONSE }
      ]
    );

    //test it handles an error response
    await assertApiActionOnError(
      path,
      api.onGetPolicy,
      [],
      (e) => [
        { type: act.REQUEST_POLICY, error: false, payload: undefined },
        { type: act.RECEIVE_POLICY, error: true, payload: e }
      ]
    );
  });

  test("on create a new user action", async () => {
    const path = "api/v1/user/new";

    //test it handles a successfull response
    await assertApiActionOnSuccess(
      path,
      api.onCreateNewUser,
      [FAKE_USER],
      [
        { type: act.REQUEST_NEW_USER, payload: { email: FAKE_USER.email  }},
        { type: act.RECEIVE_NEW_USER, error: false }
      ],
      methods.POST
    );
    await assertApiActionOnError(
      path,
      api.onCreateNewUser,
      [FAKE_USER],
      (e) => [
        { type: act.REQUEST_NEW_USER, payload: { email: FAKE_USER.email  }},
        { type: act.RECEIVE_NEW_USER, error: false, payload: e }
      ],
      methods.POST
    );
  });

  test("on verify new user action", async () => {
    const path = "begin:/api/v1/user/verify";
    const searchQuery = qs.stringify({ email: FAKE_USER.email, verificationtoken: "any" });
    await assertApiActionOnSuccess(
      path,
      api.onVerifyNewUser,
      [searchQuery],
      [
        { type: act.REQUEST_VERIFY_NEW_USER, payload: searchQuery },
        { type: act.RECEIVE_VERIFY_NEW_USER, error: false }
      ]
    );

    // await assertApiActionOnError(
    //   path,
    //   api.onVerifyNewUser,
    //   [searchQuery],
    //   (e) => [
    //     { type: act.REQUEST_VERIFY_NEW_USER, payload: searchQuery },
    //     { type: act.RECEIVE_VERIFY_NEW_USER, error: true, payload: e }
    //   ]
    // );
  });
});
