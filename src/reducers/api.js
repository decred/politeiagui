import * as act from "../actions";

const DEFAULT_REQUEST_STATE = { isRequesting: false, response: null, error: null };
export const DEFAULT_STATE = {
  requests: {
    init: DEFAULT_REQUEST_STATE,
    newUser: DEFAULT_REQUEST_STATE,
    verifyNewUser: DEFAULT_REQUEST_STATE,
    login: DEFAULT_REQUEST_STATE,
    logout: DEFAULT_REQUEST_STATE
  },
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

const receive = (key, state, { payload, error }) =>
  ({
    ...state,
    [key]: {
      ...state[key],
      isRequesting: false,
      response: error ? null : payload,
      error: error ? payload : null
    }
  });

const api = (state = DEFAULT_STATE, action) => (({
  [act.SET_EMAIL]: () => ({ ...state, email: action.payload }),
  [act.REQUEST_INIT_SESSION]: () => request("init", state, action),
  [act.RECEIVE_INIT_SESSION]: () => receive("init", state, action),
  [act.REQUEST_NEW_USER]: () => request("newUser", state, action),
  [act.RECEIVE_NEW_USER]: () => receive("newUser", state, action),
  [act.REQUEST_VERIFY_NEW_USER]: () => request("verifyNewUser", state, action),
  [act.RECEIVE_VERIFY_NEW_USER]: () => receive("verifyNewUser", state, action),
  [act.REQUEST_LOGIN]: () => request("login", state, action),
  [act.RECEIVE_LOGIN]: () => receive("login", state, action),
  [act.REQUEST_LOGOUT]: () => request("logout", state, action),
  [act.RECEIVE_LOGOUT]: () => {
    state = receive("logout", state, action);
    return {
      ...state,
      login: { ...state.login, response: null }
    };
  }
})[action.type] || (() => state))();

export default api;
