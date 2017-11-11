import * as act from "../actions";

export const DEFAULT_STATE = {
  isShowingSignup: false,
  replyParent: 0,
  newProposal: {
    name: "",
    description: ""
  }
};

const app = (state = DEFAULT_STATE, action) => (({
  [act.SET_REPLY_PARENT]: () => ({ ...state, replyParent: action.payload || 0}),
  [act.CANCEL_SIGNUP]: () => ({ ...state, isShowingSignup: false })
})[action.type] || (() => state))();

export default app;
