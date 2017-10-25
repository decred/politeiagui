import { basicAction } from "./lib";
import { onSubmitProposal, onChangePassword } from "./api";
import { onLogin as onLoginApi } from "./api";
import * as sel from "../selectors";

export const CANCEL_SIGNUP = "CANCEL_SIGNUP";

export const onCancelSignup = basicAction(CANCEL_SIGNUP);
export const onSaveNewProposal = ({ name, description, files }) =>
  (dispatch, getState) => {
    return dispatch(onSubmitProposal(name, description, files))
      .then(() => sel.newProposalToken(getState()));
  };

export const onLogin = (params) => onLoginApi(params);
export const onSaveChangePassword = ({ existingPassword, password }) =>
  (dispatch, getState) => {
    return dispatch(onChangePassword(existingPassword, password))
      .then(() => sel.newProposalToken(getState()));
  };
