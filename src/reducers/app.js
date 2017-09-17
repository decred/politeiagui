import * as act from "../actions";

export const DEFAULT_STATE = {
  isShowingSignup: false
};

const app = (state = DEFAULT_STATE, action) => (({
  [act.SHOW_SIGNUP]: () => ({ ...state, isShowingSignup: true }),
  [act.CANCEL_SIGNUP]: () => ({ ...state, isShowingSignup: false }),
})[action.type] || (() => state))();

export default app;
