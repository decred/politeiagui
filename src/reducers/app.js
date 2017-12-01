import * as act from "../actions/types";
import { TOP_LEVEL_COMMENT_PARENTID } from "../lib/api";

export const DEFAULT_STATE = {
  isShowingSignup: false,
  replyParent: TOP_LEVEL_COMMENT_PARENTID,
  newProposal: {
    name: "",
    description: ""
  },
  submittedProposals: {}
};

const app = (state = DEFAULT_STATE, action) => (({
  [act.SET_REPLY_PARENT]: () => ({ ...state, replyParent: action.payload || TOP_LEVEL_COMMENT_PARENTID}),
  [act.RECEIVE_NEW_PROPOSAL]: () => action.error ? state : ({ ...state, submittedProposals: {
    ...state.submittedProposals,
    lastSubmitted: action.payload.censorshiprecord.token,
    [action.payload.censorshiprecord.token]: action.payload
  }}),
  [act.CANCEL_SIGNUP]: () => ({ ...state, isShowingSignup: false })
})[action.type] || (() => state))();

export default app;
