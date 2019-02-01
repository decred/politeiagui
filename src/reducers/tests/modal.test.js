import modal from "../modal";
import * as act from "../../actions/types";

describe("test modal reducer", () => {
  const MOCK_STATE = {
    openedModals: []
  };

  test("correctly deals with state transitions on modal reducer", () => {
    let action = {
      type: act.OPEN_MODAL,
      payload: "modal data",
      modalType: "warning message",
      callback: "account page",
      options: {},
      error: false
    };

    const state = modal(MOCK_STATE, action);

    expect(state).toEqual({
      openedModals: [
        {
          type: action.modalType,
          payload: action.payload,
          callback: action.callback,
          options: action.options
        }
      ]
    });

    action = {
      ...action,
      type: act.CLOSE_MODAL
    };

    expect(modal(state, action)).toEqual({ openedModals: [] });
  });
});
