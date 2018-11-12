import { request, receive, reset, DEFAULT_REQUEST_STATE } from "../util";

describe("test util reducers (request, receive, reset)", () => {
  const MOCK_STATE = {
    persist: "to test state persistence by the spread operator"
  };

  test("request reducer behaving as expected", () => {
    const action = {
      payload: {
        data: "requesting data",
        status: "test"
      },
      error: false
    };

    let newState = request("apiRequestTest", MOCK_STATE, action);

    expect(newState).toEqual({
      ...MOCK_STATE,
      apiRequestTest: {
        payload: action.payload,
        isRequesting: true,
        response: null,
        error: null
      }
    });

    action.error = true;

    newState = request("apiRequestTest", MOCK_STATE, action);

    expect(newState).toEqual({
      ...MOCK_STATE,
      apiRequestTest: {
        payload: null,
        isRequesting: false,
        response: null,
        error: action.payload
      }
    });
  });

  test("receive reducer behaving as expected", () => {
    const action = {
      payload: {
        data: "receiving data",
        status: "test"
      },
      error: false
    };

    let newState = receive("apiReceiveTest", MOCK_STATE, action);

    expect(newState).toEqual({
      ...MOCK_STATE,
      apiReceiveTest: {
        isRequesting: false,
        response: action.payload,
        error: null
      }
    });

    action.error = true;

    newState = receive("apiReceiveTest", MOCK_STATE, action);

    expect(newState).toEqual({
      ...MOCK_STATE,
      apiReceiveTest: {
        isRequesting: false,
        response: null,
        error: action.payload
      }
    });
  });

  test("reset reducer behaving as expected", () => {
    const state = {
      ...MOCK_STATE,
      apitest: {
        payload: "misc data",
        isRequesting: true,
        response: null,
        error: null
      }
    };

    const newState = reset("apitest", state);

    expect(newState).toEqual({
      ...MOCK_STATE,
      apitest: DEFAULT_REQUEST_STATE
    });
  });

  test("chained reducers updating state as expected", () => {
    const action = {
      payload: {
        data: "data",
        status: "test"
      },
      error: false
    };

    let state = request("apitest", MOCK_STATE, action);

    expect(state).toEqual({
      ...MOCK_STATE,
      apitest: {
        payload: action.payload,
        isRequesting: true,
        response: null,
        error: null
      }
    });

    state = receive("apitest", state, action);

    expect(state).toEqual({
      ...MOCK_STATE,
      apitest: {
        payload: action.payload,
        isRequesting: false,
        response: action.payload,
        error: null
      }
    });

    state = reset("apitest", state);

    expect(state).toEqual({
      ...MOCK_STATE,
      apitest: DEFAULT_REQUEST_STATE
    });
  });
});
