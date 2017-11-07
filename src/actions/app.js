import Promise from "promise";
import { basicAction } from "./lib";
import { onSubmitProposal, onChangePassword, onFetchProposalComments } from "./api";
import { onFetchProposal as onFetchProposalApi } from "./api";
import * as sel from "../selectors";

export const CANCEL_SIGNUP = "CANCEL_SIGNUP";

export const onCancelSignup = basicAction(CANCEL_SIGNUP);
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
