import {
  DEFAULT_REQUEST_STATE,
  request,
  receive,
  reset,
  resetMultiple
} from "../util";

export const testRequestReducer = (reducer, key, state, action) => {
  const func_state = request(key, state, action);
  const action_state = reducer(state, action);

  expect(func_state).toEqual({
    ...state,
    [key]: {
      ...state[key],
      payload: action.error ? null : action.payload,
      isRequesting: action.error ? false : true,
      response: null,
      error: action.error ? action.payload : null
    }
  });

  expect(action_state).toEqual(func_state);
};

export const testReceiveProposalsReducer = (reducer, key, state, action) => {
  const func_state = receive(key, state, action);
  const action_state = reducer(state, action);

  expect(func_state).toEqual({
    ...state,
    [key]: {
      ...state[key],
      isRequesting: false,
      response: action.error ? null : { ...action.payload },
      error: action.error ? action.payload : null
    }
  });

  expect(action_state).toEqual(func_state);
};

export const testReceiveReducer = (reducer, key, state, action) => {
  const func_state = receive(key, state, action);
  const action_state = reducer(state, action);

  expect(func_state).toEqual({
    ...state,
    [key]: {
      ...state[key],
      isRequesting: false,
      response: action.error ? null : action.payload,
      error: action.error ? action.payload : null
    }
  });

  expect(action_state).toEqual(func_state);
};

export const testResetReducer = (reducer, key, state, action) => {
  const resetted_state = reset(key, state, action);
  const action_state = reducer(state, action);

  expect(resetted_state).toEqual({
    ...state,
    [key]: DEFAULT_REQUEST_STATE
  });

  expect(resetted_state).toEqual(action_state);
};

export const testResetMultipleReducer = (reducer, keys, state, action) => {
  const resetted_state = resetMultiple(keys, state, action);
  const action_state = reducer(state, action);

  const expected_state = keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: DEFAULT_REQUEST_STATE
    }),
    {}
  );

  expect(resetted_state).toEqual(expected_state);
  expect(resetted_state).toEqual(action_state);
};
