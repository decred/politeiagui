import Promise from "promise";
import { reset } from "redux-form";
import { onSubmitProposal, onChangePassword, onFetchProposalComments } from "./api";
import { onFetchProposal as onFetchProposalApi, onSubmitComment as onSubmitCommentApi } from "./api";
import * as sel from "../selectors";
import act from "./methods";
import { TOP_LEVEL_COMMENT_PARENTID } from "../lib/api";

export const CANCEL_SIGNUP = "CANCEL_SIGNUP";
export const SET_REPLY_PARENT = "SET_REPLY_PARENT";

export const onCancelSignup = act.CANCEL_SIGNUP;
export const onSetReplyParent = (parentId = TOP_LEVEL_COMMENT_PARENTID) =>
  (dispatch) => Promise.all([
    dispatch(act.SET_REPLY_PARENT(parentId)),
    dispatch(reset("form/reply"))
  ]);
export const onSaveNewProposal = ({ name, description, files }) =>
  (dispatch, getState) =>
    dispatch(onSubmitProposal(name, description, files))
      .then(() => sel.newProposalToken(getState()));

export const onSaveChangePassword = ({ existingPassword, password }) =>
  (dispatch, getState) =>
    dispatch(onChangePassword(existingPassword, password))
      .then(() => sel.newProposalToken(getState()));

export const onFetchProposal = (token) =>
  (dispatch) => Promise.all([
    dispatch(onFetchProposalApi(token)),
    dispatch(onFetchProposalComments(token))
  ]);

export const onSubmitComment = (...args) =>
  (dispatch) =>
    dispatch(onSubmitCommentApi(...args))
      .then(() => dispatch(onSetReplyParent()));
