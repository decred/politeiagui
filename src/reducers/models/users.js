import * as act from "src/actions/types";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";

const DEFAULT_STATE = {
  byID: {},
  currentUserID: null,
  search: {
    resultsByID: {},
    queryByEmail: {},
    queryByUsername: {}
  },
  cms: {
    byContractorType: {},
    byDomain: {},
    byID: {}
  }
};

const skip = () => (value) => value;

const onReceiveLogout = (state) =>
  compose(
    set("currentUserID", null),
    update("byID", (data) => {
      const publicData = {};
      Object.keys(data).map(
        (id) =>
          (publicData[id] = {
            id,
            userid: data[id].userid,
            isadmin: data[id].isadmin,
            username: data[id].username,
            identities: data[id].identities
          })
      );
      return publicData;
    })
  )(state);

const onReceiveCMSLogout = (state) =>
  compose(
    set("currentUserID", null),
    update("byID", (data) => {
      const publicData = {};
      Object.keys(data).map((id) => (publicData[id] = {}));
      return publicData;
    })
  )(state);

const users = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_USER]: () => {
            const userid = action.payload.user.id;
            delete action.payload.user.id;
            return update(["byID", userid], (userData) => ({
              ...userData,
              ...action.payload.user,
              userid
            }))(state);
          },
          [act.RECEIVE_ME || act.RECEIVE_LOGIN]: () =>
            compose(
              set("currentUserID", action.payload.userid),
              set(["byID", action.payload.userid], action.payload)
            )(state),
          [act.RECEIVE_EDIT_USER]: () =>
            set(
              ["byID", state.currentUserID, "emailnotifications"],
              action.payload.preferences.emailnotifications
            )(state),
          [act.RECEIVE_CHANGE_USERNAME]: () =>
            set(
              ["byID", state.currentUserID, "username"],
              action.payload.username
            )(state),
          [act.RECEIVE_VERIFIED_KEY]: () =>
            set(
              ["byID", state.currentUserID, "publickey"],
              action.payload.publickey
            )(state),
          [act.RECEIVE_MANAGE_CMS_USER]: () => {
            const { domain, type, supervisorIDs, userID } = action.payload;
            return update(["byID", userID], (user) => ({
              ...user,
              domain,
              contractortype: type,
              supervisoruserids: supervisorIDs
            }))(state);
          },
          [act.RECEIVE_USER_SEARCH]: () => {
            const {
              users,
              query: { email, username }
            } = action.payload;
            const usersByID = users.reduce(
              (res, user) => ({ ...res, [user.id]: user }),
              {}
            );
            const usersIds = users.map((user) => user.id);
            const searchedByEmail = !!email;
            const searchedByUsername = !!username;
            return compose(
              update("search.resultsByID", (users) => ({
                ...users,
                ...usersByID
              })),
              searchedByEmail
                ? set(["search", "queryByEmail", email], usersIds)
                : skip(),
              searchedByUsername
                ? set(["search", "queryByUsername", username], usersIds)
                : skip()
            )(state);
          },
          [act.RECEIVE_LOGOUT]: () => onReceiveLogout(state),
          [act.RECEIVE_CMS_LOGOUT]: () => onReceiveCMSLogout(state),
          [act.RECEIVE_CMS_USERS]: () => {
            const { users } = action.payload;
            const byContractorType = users.reduce((res, user) => {
              const usersFromContractorType = res[user.contractortype] || [];
              return {
                ...res,
                [user.contractortype]: [user, ...usersFromContractorType]
              };
            }, {});
            const byDomain = users.reduce((res, user) => {
              const usersFromDomain = res[user.domain] || [];
              return {
                ...res,
                [user.domain]: [user, ...usersFromDomain]
              };
            }, {});
            const byID = users.reduce((res, user) => {
              return {
                ...res,
                [user.id]: user
              };
            }, {});
            return set("cms", {
              byContractorType,
              byDomain,
              byID
            })(state);
          }
        }[action.type] || (() => state)
      )();

export default users;
