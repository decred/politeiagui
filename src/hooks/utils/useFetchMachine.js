import { useReducer, useEffect, useCallback } from "react";
import get from "lodash/get";
import set from "lodash/fp/set";
import compose from "lodash/fp/compose";

// state transition actions
export const FETCH = "FETCH";
export const RESOLVE = "RESOLVE";
export const VERIFY = "VERIFY";
export const REJECT = "REJECT";
export const RETRY = "RETRY";
// machine states
const LOADING = "loading";
const IDLE = "idle";
const FAILURE = "failure";
const SUCCESS = "success";
const VERIFYING = "verifying";

const DEFAULT_STATE = {
  status: IDLE,
  loading: false
};

const mapStateTransitionActions = {
  [FETCH]: LOADING,
  [VERIFY]: VERIFYING,
  [REJECT]: FAILURE,
  [RESOLVE]: SUCCESS,
  [RETRY]: IDLE
};

const getNextState = (action) => get(mapStateTransitionActions, action.type);

const fetchReducer = (state, action) => {
  const nextState = getNextState(action);
  if (!nextState) {
    return set("error", new Error("unhanlded state change"))(state);
  }
  switch (action.type) {
    case FETCH:
      return compose(
        set("status", nextState),
        set("loading", true),
        set("verifying", false)
      )(state);
    case RESOLVE:
      return {
        ...state,
        loading: false,
        verifying: false,
        status: nextState,
        ...action.payload
      };
    case VERIFY:
      return compose(
        set("loading", false),
        set("verifying", true),
        set("status", nextState)
      )(state);
    case REJECT:
      return compose(
        set("loading", false),
        set("verifying", false),
        set("error", action.payload),
        set("status", nextState)
      )(state);
    case RETRY:
      return action.payload;
    default:
      return set("error", new Error("unhanlded state machine action"))(state);
  }
};

export default function useFetchMachine({ actions, initialValues }) {
  const [currentState, dispatch] = useReducer(
    fetchReducer,
    initialValues || DEFAULT_STATE
  );
  useEffect(
    function onStateChanges() {
      const { status } = currentState;
      switch (status) {
        case IDLE:
          return actions.initial && actions.initial();
        case LOADING:
          return actions.load && actions.load();
        case VERIFYING:
          return actions.verify && actions.verify();
        case SUCCESS:
          return actions.done && actions.done();
        case FAILURE:
          return actions.error && actions.error();
        default:
          return;
      }
    },
    [currentState, actions, dispatch]
  );

  const send = useCallback(
    (action, payload) => dispatch({ type: action, payload }),
    [dispatch]
  );

  return [currentState, send, { FETCH, RESOLVE, VERIFY, REJECT, RETRY }];
}
