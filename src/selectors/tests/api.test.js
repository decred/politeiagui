import * as sel from "../api";
import { MOCK_STATE } from "./mock_state";

describe("test api selectors", () => {
  test("testing higher order selectors", () => {
    // isRequesting
    expect(sel.getIsApiRequesting("init")({})).toEqual(false);
    expect(sel.getIsApiRequesting("init")(MOCK_STATE)).toEqual(true);

    // payload
    expect(sel.getApiPayload("newUser")({})).toEqual(undefined);
    expect(sel.getApiPayload("newUser")(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newUser.payload
    );

    // response
    expect(sel.getApiResponse("newUser")({})).toEqual(undefined);
    expect(sel.getApiResponse("newUser")(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newUser.response
    );

    // error
    expect(sel.getApiError("newUser")({})).toEqual(undefined);
    expect(sel.getApiError("newUser")(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newUser.error
    );
  });

  test("testing or selectors", () => {
    let state;

    state = {
      api: {
        ...MOCK_STATE.api,
        proposal: { isRequesting: false },
        startVote: { isRequesting: false },
        init: { isRequesting: false }
      }
    };

    // isAdmin
    expect(sel.isAdmin(MOCK_STATE)).toEqual(true);

    state = {
      api: { ...MOCK_STATE.api, me: { response: { isadmin: false } } }
    };

    expect(sel.isAdmin(state)).toEqual(true);

    state = {
      api: {
        ...MOCK_STATE.api,
        me: { response: { isadmin: false } },
        login: { response: { isadmin: false } }
      }
    };

    expect(sel.isAdmin(state)).toEqual(false);
  });
});
