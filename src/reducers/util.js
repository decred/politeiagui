export const DEFAULT_REQUEST_STATE = {
  isRequesting: false,
  error: null
};

export const request = (key, state, { payload, error }) =>
  payload
    ? {
        ...state,
        [key]: {
          ...state[key],
          payload: error ? null : payload,
          isRequesting: error ? false : true,
          error: error ? payload : null
        }
      }
    : {
        ...state,
        [key]: {
          ...state[key],
          isRequesting: error ? false : true,
          error: error ? payload : null
        }
      };

export const receive = (key, state, { payload, error } = {}, keepError) => ({
  ...state,
  [key]: {
    ...state[key],
    payload: error ? null : payload,
    isRequesting: false,
    error: error ? payload : keepError ? state[key].error : null
  }
});

export const reset = (key, state) => ({
  ...state,
  [key]: DEFAULT_REQUEST_STATE
});

export const resetMultiple = (keys, state) =>
  keys.reduce((acc, key) => ({ ...acc, [key]: DEFAULT_REQUEST_STATE }), state);
