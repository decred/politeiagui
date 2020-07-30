import { useReducer, useEffect, useCallback } from "react";
import get from "lodash/get";
import set from "lodash/fp/set";
import compose from "lodash/fp/compose";

const DEFAULT_STATE = {
  status: "idle",
  loading: false
};

const stateTransitionActions = {
  FETCH: "loading",
  VERIFY: "verifying",
  REJECT: "failure",
  RESOLVE: "success",
  RETRY: "idle"
};

const getNextState = (action) => get(stateTransitionActions, action.type);

const fetchReducer = (state, action) => {
  const nextState = getNextState(action);
  if (!nextState) {
    return set("error", new Error("unhanlded state change"))(state);
  }
  switch (action.type) {
    case "FETCH":
      return compose(
        set("status", nextState),
        set("loading", true),
        set("verifying", false)
      )(state);
    case "RESOLVE":
      return {
        ...state,
        loading: false,
        verifying: false,
        status: nextState,
        ...action.payload
      };
    case "VERIFY":
      return compose(
        set("loading", false),
        set("verifying", true),
        set("status", nextState)
      )(state);
    case "REJECT":
      return compose(
        set("loading", false),
        set("error", action.payload),
        set("status", nextState)
      )(state);
    default:
      return set("error", new Error("unhanlded state machine action"))(state);
  }
};

export default function useFetchMachine({ actions, initialState }) {
  const [currentState, dispatch] = useReducer(
    fetchReducer,
    initialState || DEFAULT_STATE
  );
  useEffect(
    function onStateChanges() {
      const { status } = currentState;
      switch (status) {
        case "idle":
          return actions.initial && actions.initial();
        case "loading":
          return actions.load && actions.load();
        case "verifying":
          return actions.verify && actions.verify();
        case "success":
          return actions.done && actions.done();
        case "failure":
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

  return [currentState, send];
}
