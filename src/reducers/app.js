import * as act from "../actions/types";

export const DEFAULT_STATE = {
  isShowingSignup: false,
  replyParent: 0,
  newProposal: {
    name: "",
    description: ""
  },
  submittedProposals: {}
};

const app = (state = DEFAULT_STATE, action) => (({
  [act.SET_REPLY_PARENT]: () => ({ ...state, replyParent: action.payload || 0}),
  [act.RECEIVE_NEW_PROPOSAL]: () => ({ ...state, submittedProposals: {
    ...state.submittedProposals,
    lastSubmitted: action.payload.censorshiprecord.token,
    [action.payload.censorshiprecord.token]: action.payload
  }}),
  [act.CANCEL_SIGNUP]: () => ({ ...state, isShowingSignup: false })
})[action.type] || (() => state))();

export default app;
