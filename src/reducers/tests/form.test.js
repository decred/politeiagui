import * as act from "../../actions/types";
import formReducer from "../form";

describe("test redux form reducers", () => {
  test("form/proposal behaving correctly", () => {
    const action = {
      type: act.RECEIVE_NEW_PROPOSAL,
      error: false
    };

    expect(formReducer({}, action)).toEqual({});

    action.error = true;

    expect(formReducer({}, action)).toEqual({});

    action.type = act.SAVE_DRAFT_PROPOSAL;
    action.error = false;

    expect(formReducer({}, action)).toEqual({});
  });

  test("form/reply behaving correctly", () => {
    const action = {
      type: act.RECEIVE_NEW_COMMENT,
      error: false
    };

    expect(formReducer({}, action)).toEqual({});
  });

  test("form/change-username behaving correctly", () => {
    const action = {
      type: act.RECEIVE_CHANGE_USERNAME,
      error: false
    };

    expect(formReducer({}, action)).toEqual({});

    action.error = true;

    expect(formReducer({}, action)).toEqual({});
  });

  test("form/change-password behaving correctly", () => {
    const action = {
      type: act.RECEIVE_CHANGE_PASSWORD,
      error: false
    };

    expect(formReducer({}, action)).toEqual({});

    action.error = true;

    expect(formReducer({}, action)).toEqual({});
  });
});
