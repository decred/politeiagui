import { basicAction } from "./lib";
import { onSubmitProposal, onRequestNewProposal } from "./api";
import * as sel from "../selectors";

export const SHOW_SIGNUP = "SHOW_SIGNUP";
export const CANCEL_SIGNUP = "CANCEL_SIGNUP";
export const SET_NEW_PROPOSAL_NAME = "SET_NEW_PROPOSAL_NAME";
export const SET_NEW_PROPOSAL_DESCRIPTION = "SET_NEW_PROPOSAL_DESCRIPTION";

export const onShowSignup = basicAction(SHOW_SIGNUP);
export const onCancelSignup = basicAction(CANCEL_SIGNUP);

export const onSetNewProposalName = basicAction(SET_NEW_PROPOSAL_NAME);
export const onSetNewProposalDescription = basicAction(SET_NEW_PROPOSAL_DESCRIPTION);

export const onSaveNewProposal = () =>
  (dispatch, getState) => {
    const state = getState();
    const name = sel.newProposalName(state);
    const description = sel.newProposalDescription(state);

    if (sel.newProposalNameIsInvalid(state)) {
      return dispatch(onRequestNewProposal(null, "Proposal name is invalid"));
    } else if (sel.newProposalDescriptionIsInvalid(state)) {
      return dispatch(onRequestNewProposal(null, "Proposal description is invalid"));
    } else if (sel.newProposalIsInvalid(state)) {
      return dispatch(onRequestNewProposal(null, "Proposal is invalid"));
    }

    return dispatch(onSubmitProposal(name, description))
      .then(() => sel.newProposalToken(getState()));
  };
