import * as act from "src/actions/types";
import set from "lodash/fp/set";

const DEFAULT_STATE = {
  byID: {},
  me: null
};

const users = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : ({
        [act.RECEIVE_USER]: () =>
          set(["byID", action.payload.user.id], action.payload.user)(state),
        [act.RECEIVE_ME]: () => set("me", action.payload)(state),
        [act.RECEIVE_LOGIN]: () => set("me", action.payload)(state),
        [act.RECEIVE_LOGOUT]: () => set("me", null)(state)
      }[action.type] || (() => state))();

export default users;
