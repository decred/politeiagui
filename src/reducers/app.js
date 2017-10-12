import * as act from "../actions";

export const DEFAULT_STATE = {
  isShowingSignup: false,
  newProposal: {
    name: "",
    description: ""
  }
};

const app = (state = DEFAULT_STATE, action) => (({
  [act.CANCEL_SIGNUP]: () => ({ ...state, isShowingSignup: false }),
})[action.type] || (() => state))();

export default app;
