import * as act from "src/actions/types";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";

const DEFAULT_STATE = {
  byID: {},
  currentUserID: null
};

const filterPublicData = byIdData => {
  const publicData = {};
  Object.keys(byIdData).map(
    id =>
      (publicData[id] = {
        id,
        isadmin: byIdData[id].isadmin,
        username: byIdData[id].username,
        identities: byIdData[id].identities
      })
  );
  return publicData;
};

const updateUserPublicKey = (byIdData, userid, newpubkey) => {
  const updatedData = {};
  Object.keys(byIdData).map(id =>
    id === userid
      ? (updatedData[id] = {
          ...byIdData[id],
          publickey: newpubkey
        })
      : (updatedData[id] = byIdData[id])
  );
  return updatedData;
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
        [act.RECEIVE_ME || act.RECEIVE_LOGIN]: () =>
          compose(
            set("currentUserID", action.payload.userid),
            update(["byID", action.payload.userid], userData => ({
              ...userData,
              ...action.payload,
              id: action.payload.userid
            }))
          )(state),
        [act.RECEIVE_LOGOUT]: () =>
          compose(
            set("currentUserID", null),
            update("byID", data => filterPublicData(data))
          )(state),
        [act.RECEIVE_UPDATED_KEY]: () =>
          update("byID", data =>
            updateUserPublicKey(
              data,
              action.payload.userid,
              action.payload.publickey
            )
          )(state)
      }[action.type] || (() => state))();

export default users;
