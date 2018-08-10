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
import { onLogout, cleanErrors } from "./api";
import { loadStateLocalStorage, loggedInStateKey } from "../lib/local_storage";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_STARTED,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_FILTER_ALL
} from "../constants";

export const SET_REPLY_PARENT = "SET_REPLY_PARENT";

export const onRouteChange = () => dispatch => {
  dispatch(cleanErrors());
  dispatch(act.CLEAN_SLATE());
};

export const onSetReplyParent = (parentId = TOP_LEVEL_COMMENT_PARENTID) =>
  (dispatch) => Promise.all([
    dispatch(act.SET_REPLY_PARENT(parentId)),
    dispatch(reset("form/reply"))
  ]);
export const onSaveNewProposal = ({ name, description, files }, _, props) =>
  (dispatch, getState) =>
    dispatch(onSubmitProposal(props.loggedInAsEmail, props.userid, props.username, name.trim(), description, files))
      .then(() => sel.newProposalToken(getState()));

export const onSaveDraftProposal = ({ name, description, files, draftId }) =>
  act.SAVE_DRAFT_PROPOSAL({ name: name.trim(), description, files, timestamp: Date.now() / 1000, draftId });

export const onLoadDraftProposals = (email) => {
  const stateFromLS = loadStateLocalStorage(email);
  const drafts = sel.draftProposals(stateFromLS) || {};
  return act.LOAD_DRAFT_PROPOSALS(drafts);
};

export const onDeleteDraftProposal = (draftId) =>
  act.DELETE_DRAFT_PROPOSAL(draftId);

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
export const onChangeUserFilter = (option) => act.CHANGE_USER_FILTER_VALUE(option);

export const onChangeProposalStatusApproved = (status) => act.SET_PROPOSAL_APPROVED(status);

export const onIdentityImported = (successMsg, errorMsg = "") => act.IDENTITY_IMPORTED({ errorMsg, successMsg });

export const onSubmitComment = (...args) =>
  (dispatch) =>
    dispatch(onSubmitCommentApi(...args))
      .then(() => dispatch(onSetReplyParent()));

export const onLocalStorageChange = (event) => (dispatch, getState) => {
  const state = getState();

  if(event.key !== loggedInStateKey) {
    return;
  }

  const apiMeResponse =  sel.apiMeResponse(state);

  try {
    const stateFromStorage = JSON.parse(event.newValue);
    const apiMeFromStorage = get(stateFromStorage, ["api", "me"], undefined);
    const apiMeResponseFromStorage = sel.apiMeResponse(stateFromStorage);

    if(apiMeResponseFromStorage && !isEqual(apiMeResponseFromStorage, apiMeResponse)) {
      dispatch(onLoadMe(apiMeFromStorage));
    }
    else if (!stateFromStorage || (stateFromStorage && !apiMeFromStorage)) dispatch(onLogout());
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

export const selectDefaultPublicFilterValue = (dispatch, getState) => {
  const filterValue = selectDefaultFilterValue(sel.getVettedProposalFilterCounts(getState()), [
    PROPOSAL_VOTING_ACTIVE,
    PROPOSAL_VOTING_NOT_STARTED,
    PROPOSAL_FILTER_ALL
  ]);
  dispatch(onChangePublicFilter(filterValue));
};

export const selectDefaultAdminFilterValue = (dispatch, getState) => {
  const filterValue = selectDefaultFilterValue(sel.getUnvettedProposalFilterCounts(getState()), [
    PROPOSAL_STATUS_UNREVIEWED,
    PROPOSAL_FILTER_ALL
  ]);
  dispatch(onChangeAdminFilter(filterValue));
};

// Chooses a sensible default filter - don't pick a filter with 0 proposals.
const selectDefaultFilterValue = (proposalFilterCounts, defaultFilterPreferences) => {
  for(let filterPreference of defaultFilterPreferences) {
    if((proposalFilterCounts[filterPreference] || 0) > 0) {
      return filterPreference;
    }
  }

  return defaultFilterPreferences[defaultFilterPreferences.length - 1];
};

export const setOnboardAsViewed = () => act.SET_ONBOARD_AS_VIEWED();

export const onSetCommentsSortOption = (option) => act.SET_COMMENTS_SORT_OPTION(option);
