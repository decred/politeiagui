import * as act from "src/actions/types";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";

const DEFAULT_STATE = {
  byID: {},
  currentUserID: null
};

const onReceiveLogout = state =>
  compose(
    set("currentUserID", null),
    update("byID", data => {
      const publicData = {};
      Object.keys(data).map(
        id =>
          (publicData[id] = {
            id,
            isadmin: data[id].isadmin,
            username: data[id].username,
            identities: data[id].identities
          })
      );
      return publicData;
    })
  )(state);

const onReceiveUpdatedKey = (state, action) =>
  update("byID", data => {
    const updatedData = {};
    Object.keys(data).map(id =>
      id === action.payload.userid
        ? (updatedData[id] = {
            ...data[id],
            publickey: action.payload.publickey
          })
        : (updatedData[id] = data[id])
    );
    return updatedData;
  })(state);

const onReceiveChangeUsername = (state, action) =>
  update("byID", data => {
    const updatedData = {};
    Object.keys(data).map(id =>
      id === action.payload.userid
        ? (updatedData[id] = {
            ...data[id],
            username: action.payload.username
          })
        : (updatedData[id] = data[id])
    );
    return updatedData;
  })(state);

const users = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : ({
        [act.RECEIVE_USER]: () =>
          update(["byID", action.payload.user.id], userData => ({
            ...userData,
            ...action.payload.user
          }))(state),
        [act.RECEIVE_ME || act.RECEIVE_LOGIN]: () =>
          compose(
            set("currentUserID", action.payload.userid),
            update(["byID", action.payload.userid], userData => ({
              ...userData,
              ...action.payload,
              id: action.payload.userid
            }))
          )(state),
        [act.RECEIVE_CHANGE_USERNAME]: () =>
          onReceiveChangeUsername(state, action),
        [act.RECEIVE_UPDATED_KEY]: () => onReceiveUpdatedKey(state, action),
        [act.RECEIVE_LOGOUT]: () => onReceiveLogout(state)
      }[action.type] || (() => state))();

export default users;
