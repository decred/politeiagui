import * as act from "../actions";

export const DEFAULT_STATE = {
  isShowingSignup: false,
  newProposal: {
    name: "",
    description: ""
  }
};

const app = (state = DEFAULT_STATE, action) => (({
  [act.SHOW_SIGNUP]: () => ({ ...state, isShowingSignup: true }),
  [act.CANCEL_SIGNUP]: () => ({ ...state, isShowingSignup: false }),
  [act.SET_NEW_PROPOSAL_NAME]: () => ({
    ...state,
    newProposal: {
      ...state.newProposal,
      name: action.payload
    }
  }),
  [act.SET_NEW_PROPOSAL_DESCRIPTION]: () => ({
    ...state,
    newProposal: {
      ...state.newProposal,
      description: action.payload
    }
  })
})[action.type] || (() => state))();

export default app;
