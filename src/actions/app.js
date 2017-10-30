import { basicAction } from "./lib";
import { onSubmitProposal, onChangePassword } from "./api";
import { onLogin as onLoginApi, onFetchProposal } from "./api";
import * as sel from "../selectors";

const SIDEBAR = process.env.REACT_APP_SIDEBAR || "058fb054cdc172f5eaa6de334a271fb8a4b36a2a0fea2ac3bd7bb727d04f35e8";
export const CANCEL_SIGNUP = "CANCEL_SIGNUP";

export const onCancelSignup = basicAction(CANCEL_SIGNUP);
export const onSaveNewProposal = ({ name, description, files }) =>
  (dispatch, getState) => {
    return dispatch(onSubmitProposal(name, description, files))
      .then(() => sel.newProposalToken(getState()));
  };

export const onSaveChangePassword = ({ existingPassword, password }) =>
  (dispatch, getState) => {
    return dispatch(onChangePassword(existingPassword, password))
      .then(() => sel.newProposalToken(getState()));
  };

export const onLogin = (params) => onLoginApi(params);

export const onFetchSidebar = () =>
  (dispatch) => dispatch(onFetchProposal(SIDEBAR, "sidebar"));
