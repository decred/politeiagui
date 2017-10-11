import { basicAction } from "./lib";
import { onSubmitProposal } from "./api";
import * as sel from "../selectors";

export const SHOW_SIGNUP = "SHOW_SIGNUP";
export const CANCEL_SIGNUP = "CANCEL_SIGNUP";

export const onShowSignup = basicAction(SHOW_SIGNUP);
export const onCancelSignup = basicAction(CANCEL_SIGNUP);
export const onSaveNewProposal = ({ name, description }) =>
  (dispatch, getState) => {
    return dispatch(onSubmitProposal(name, description))
      .then(() => sel.newProposalToken(getState()));
  };
