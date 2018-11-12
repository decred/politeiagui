export const DEFAULT_REQUEST_STATE = {
  isRequesting: false,
  response: null,
  error: null
};

export const request = (key, state, { payload, error }) => ({
  ...state,
  [key]: {
    ...state[key],
    payload: error ? null : payload,
    isRequesting: error ? false : true,
    response: state[key] ? state[key].response : null,
    error: error ? payload : null
  }
});

export const receive = (key, state, { payload, error }) => ({
  ...state,
  [key]: {
    ...state[key],
    isRequesting: false,
    response: error ? null : payload,
    error: error ? payload : null
  }
});

export const reset = (key, state) => ({
  ...state,
  [key]: DEFAULT_REQUEST_STATE
});

export const resetMultiple = (keys, state) =>
  keys.reduce((acc, key) => ({ ...acc, [key]: DEFAULT_REQUEST_STATE }), state);
