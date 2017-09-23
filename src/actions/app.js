import { basicAction } from "./lib";

export const SHOW_SIGNUP = "SHOW_SIGNUP";
export const CANCEL_SIGNUP = "CANCEL_SIGNUP";
export const SET_NEW_PROPOSAL_NAME = "SET_NEW_PROPOSAL_NAME";
export const SET_NEW_PROPOSAL_DESCRIPTION = "SET_NEW_PROPOSAL_DESCRIPTION";

export const onShowSignup = basicAction(SHOW_SIGNUP);
export const onCancelSignup = basicAction(CANCEL_SIGNUP);

export const onSetNewProposalName = basicAction(SET_NEW_PROPOSAL_NAME);
export const onSetNewProposalDescription = basicAction(SET_NEW_PROPOSAL_DESCRIPTION);
