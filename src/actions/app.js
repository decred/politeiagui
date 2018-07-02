import Promise from "promise";
import { reset } from "redux-form";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { onSubmitProposal, onChangeUsername, onChangePassword, onFetchProposalComments } from "./api";
import { onFetchProposal as onFetchProposalApi, onSubmitComment as onSubmitCommentApi } from "./api";
import { onFetchUsernamesById as onFetchUsernamesByIdApi } from "./api";
import * as sel from "../selectors";
import act from "./methods";
import { TOP_LEVEL_COMMENT_PARENTID } from "../lib/api";
import { onLogout } from "./api";
import { loadStateLocalStorage } from "../lib/local_storage";

export const CANCEL_SIGNUP = "CANCEL_SIGNUP";
export const SET_REPLY_PARENT = "SET_REPLY_PARENT";

export const onCancelSignup = act.CANCEL_SIGNUP;
export const onSetReplyParent = (parentId = TOP_LEVEL_COMMENT_PARENTID) =>
  (dispatch) => Promise.all([
    dispatch(act.SET_REPLY_PARENT(parentId)),
    dispatch(reset("form/reply"))
  ]);
export const onSaveNewProposal = ({ name, description, files }, _, props) =>
  (dispatch, getState) =>
    dispatch(onSubmitProposal(props.loggedInAsEmail, props.userid, props.username, name, description, files))
      .then(() => sel.newProposalToken(getState()));

export const onSaveChangeUsername = ({ password, newUsername }) =>
  (dispatch, getState) =>
    dispatch(onChangeUsername(password, newUsername))
      .then(() => sel.newProposalToken(getState()));

export const onSaveChangePassword = ({ existingPassword, newPassword }) =>
  (dispatch, getState) =>
    dispatch(onChangePassword(existingPassword, newPassword))
      .then(() => sel.newProposalToken(getState()));

export const onFetchProposal = (token) => (dispatch, getState) =>
  dispatch(onFetchProposalApi(token))
    .then(() => dispatch(onFetchProposalComments(token)))
    .then(() => {
      let userIds = [];
      let comments = sel.apiProposalComments(getState());
      if(comments) {
        userIds = comments.map(comment => comment.userid);
      }
      return dispatch(onFetchUsernamesById(userIds));
    });

export const onLoadMe = me => dispatch => dispatch(act.LOAD_ME(me));

export const onChangeAdminFilter = (option) => act.CHANGE_ADMIN_FILTER_VALUE(option);
export const onChangePublicFilter = (option) => act.CHANGE_PUBLIC_FILTER_VALUE(option);

export const onChangeProposalStatusApproved = (status) => act.SET_PROPOSAL_APPROVED(status);

export const onSubmitComment = (...args) =>
  (dispatch) =>
    dispatch(onSubmitCommentApi(...args))
      .then(() => dispatch(onSetReplyParent()));

export const onLocalStorageChange = (event) => (dispatch, getState) => {
  const apiMe = get(getState(), ["api", "me"], undefined);
  const apiMeResponse = get(apiMe, "response", undefined);
  try {
    const state = JSON.parse(event.newValue);
    const apiMeFromStorage = get(loadStateLocalStorage(), ["api", "me"], undefined);
    const apiMeResponseFromStorage = get(apiMeFromStorage, "response", undefined);
    if(apiMeResponseFromStorage && !isEqual(apiMeResponseFromStorage, apiMeResponse)) {
      dispatch(onLoadMe(apiMeFromStorage));
    }
    else if (!state || (state && !state.api.me.response)) dispatch(onLogout());
  } catch(e) {
    dispatch(onLogout());
  }
};

export const globalUsernamesById = {};
export const onFetchUsernamesById = (userIds) => (dispatch, getState) => {
  let usernamesById = {};
  let userIdsToFetch = [];
  for(let userId of userIds) {
    if(userId in globalUsernamesById) {
      usernamesById[userId] = globalUsernamesById[userId];
    }
    else {
      userIdsToFetch.push(userId);
    }
  }

  // All usernames were found in the global cache, so no need
  // to make a server request.
  if(userIdsToFetch.length === 0) {
    return dispatch(act.RECEIVE_USERNAMES({ usernamesById }));
  }

  return dispatch(onFetchUsernamesByIdApi(userIdsToFetch))
    .then(() => {
      const apiUsernamesByIdResponse = get(getState(), ["api", "usernamesById", "response"], undefined);
      if(apiUsernamesByIdResponse) {
        userIdsToFetch.forEach((userId, idx) => {
          let username = apiUsernamesByIdResponse.usernames[idx];
          if(username) {
            usernamesById[userId] = globalUsernamesById[userId] = username;
          }
        });
      }

      return dispatch(act.RECEIVE_USERNAMES({ usernamesById }));
    });
};
