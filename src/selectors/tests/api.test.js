import * as sel from "../api";
import { MOCK_STATE } from "./mock_state";

describe("test api selectors", () => {
  test("testing higher order selectors", () => {
    // isRequesting
    expect(sel.getIsApiRequesting("startVote")({})).toEqual(false);
    expect(sel.getIsApiRequesting("startVote")(MOCK_STATE)).toEqual(true);

    // payload
    expect(sel.getApiPayload("newUser")({})).toEqual(undefined);
    expect(sel.getApiPayload("newUser")(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newUser.payload
    );

    // error
    expect(sel.getApiError("newUser")({})).toEqual(undefined);
    expect(sel.getApiError("newUser")(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newUser.error
    );
  });
});
