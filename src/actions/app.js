import Promise from "promise";
import { reset } from "redux-form";
import { basicAction } from "./lib";
import { onSubmitProposal, onChangePassword, onFetchProposalComments } from "./api";
import { onFetchProposal as onFetchProposalApi, onSubmitComment as onSubmitCommentApi } from "./api";
import * as sel from "../selectors";

export const CANCEL_SIGNUP = "CANCEL_SIGNUP";
export const SET_REPLY_PARENT = "SET_REPLY_PARENT";

export const onCancelSignup = basicAction(CANCEL_SIGNUP);

const _onSetReplyParent = basicAction(SET_REPLY_PARENT);
export const onSetReplyParent = (parentId = 0) =>
  (dispatch) => Promise.all([
    dispatch(_onSetReplyParent(parentId)),
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
