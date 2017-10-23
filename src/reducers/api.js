import * as act from "../actions";

const DEFAULT_REQUEST_STATE = { isRequesting: false, response: null, error: null };
export const DEFAULT_STATE = {
  me: DEFAULT_REQUEST_STATE,
  init: DEFAULT_REQUEST_STATE,
  policy: DEFAULT_REQUEST_STATE,
  newUser: DEFAULT_REQUEST_STATE,
  verifyNewUser: DEFAULT_REQUEST_STATE,
  login: DEFAULT_REQUEST_STATE,
  logout: DEFAULT_REQUEST_STATE,
  vetted: DEFAULT_REQUEST_STATE,
  unvetted: DEFAULT_REQUEST_STATE,
  proposal: DEFAULT_REQUEST_STATE,
  newProposal: DEFAULT_REQUEST_STATE,
  email: ""
};

const request = (key, state, { payload, error }) =>
  ({
    ...state,
    [key]: {
      ...state[key],
      payload: error ? null : payload,
      isRequesting: error ? false : true,
      response: null,
      error: error ? payload : null
    }
  });

const receive = (key, state, { payload, error }) => ({
  ...state,
  [key]: {
    ...state[key],
    isRequesting: false,
    response: error ? null : payload,
    error: error ? payload : null
  }
});

const reset = (key, state) => ({ ...state, [key]: DEFAULT_REQUEST_STATE });

const api = (state = DEFAULT_STATE, action) => (({
  [act.SET_EMAIL]: () => ({ ...state, email: action.payload }),
  [act.REQUEST_ME]: () => request("me", state, action),
  [act.RECEIVE_ME]: () => receive("me", state, action),
  [act.REQUEST_INIT_SESSION]: () => request("init", state, action),
  [act.RECEIVE_INIT_SESSION]: () => receive("init", state, action),
  [act.REQUEST_POLICY]: () => request("policy", state, action),
  [act.RECEIVE_POLICY]: () => receive("policy", state, action),
  [act.REQUEST_NEW_USER]: () => request("newUser", state, action),
  [act.RECEIVE_NEW_USER]: () => receive("newUser", state, action),
  [act.RESET_NEW_USER]: () => reset("newUser", state),
  [act.REQUEST_VERIFY_NEW_USER]: () => request("verifyNewUser", state, action),
  [act.RECEIVE_VERIFY_NEW_USER]: () => receive("verifyNewUser", state, action),
  [act.REQUEST_LOGIN]: () => request("login", state, action),
  [act.RECEIVE_LOGIN]: () => receive("login", state, action),
  [act.REQUEST_VETTED]: () => request("vetted", state, action),
  [act.RECEIVE_VETTED]: () => receive("vetted", state, action),
  [act.REQUEST_UNVETTED]: () => request("unvetted", state, action),
  [act.RECEIVE_UNVETTED]: () => receive("unvetted", state, action),
  [act.REQUEST_PROPOSAL]: () => request("proposal", state, action),
  [act.RECEIVE_PROPOSAL]: () => receive("proposal", state, action),
  [act.REQUEST_NEW_PROPOSAL]: () => request("newProposal", state, action),
  [act.RECEIVE_NEW_PROPOSAL]: () => receive("newProposal", state, action),
  [act.RESET_PROPOSAL]: () => reset("newProposal", state),
  [act.REDIRECTED_FROM]: () => ({ ...state, login: { ...state.login, redirectedFrom: action.payload } }),
  [act.RESET_REDIRECTED_FROM]: () => reset("login", state),
  [act.REQUEST_SETSTATUS_PROPOSAL]: () => request("setStatusProposal", state, action),
  [act.RECEIVE_SETSTATUS_PROPOSAL]: () => receive("setStatusProposal", state, action),
  [act.REQUEST_LOGOUT]: () => request("logout", state, action),
  [act.RECEIVE_LOGOUT]: () => {
    state = receive("logout", state, action);
    return {
      ...state,
      login: { ...state.login, response: null },
      me: { ...state.me, response: null }
    };
  }
})[action.type] || (() => state))();

export default api;
