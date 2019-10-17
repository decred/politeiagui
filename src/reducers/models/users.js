import * as act from "src/actions/types";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";

const DEFAULT_STATE = {
  byID: {},
  currentUserID: null
};

const users = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : ({
        [act.RECEIVE_USER]: () =>
          update(["byID", action.payload.user.id], userData => ({
            ...userData,
            ...action.payload.user
          }))(state),
        [act.RECEIVE_ME]: () =>
          compose(
            set("currentUserID", action.payload.userid),
            update(["byID", action.payload.userid], userData => ({
              ...userData,
              ...action.payload,
              id: action.payload.userid
            }))
          )(state),
        [act.RECEIVE_LOGOUT]: () => {
          console.log(state);
          return set("currentUserID", null)(state);
        }
      }[action.type] || (() => state))();

export default users;
