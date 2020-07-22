import { useReducer, useEffect, useCallback } from "react";
import set from "lodash/fp/set";
import compose from "lodash/fp/compose";

const DEFAULT_STATE = {
  status: "idle",
  loading: false
};

const states = {
  idle: {
    entry: "initial",
    on: {
      FETCH: "loading",
      RESOLVE: "verifying",
      REJECT: "failure"
    }
  },
  loading: {
    entry: "load",
    on: {
      VERIFY: "verifying",
      REJECT: "failure",
      FETCH: "loading"
    }
  },
  verifying: {
    on: {
      FETCH: "loading",
      RESOLVE: "success",
      REJECT: "failure"
    }
  },
  success: {
    on: {
      REJECT: "failure"
    }
  },
  failure: {
    on: {
      RETRY: "loading"
    }
  }
};

const fetchReducer = (state, action) => {
  const nextState = states[state.status].on[action.type];
  switch (action.type) {
    case "FETCH":
      return compose(set("status", nextState), set("loading", true))(state);
    case "RESOLVE":
      return { ...state, status: nextState, loading: false, ...action.payload };
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
      throw new Error("unhanlded action");
  }
};

export default function useFetchMachine(props) {
  const { actions } = props;
  const [currentState, dispatch] = useReducer(fetchReducer, DEFAULT_STATE);

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
      }
    },
    [currentState, actions, dispatch]
  );

  const send = useCallback(
    (action, payload) => {
      return dispatch({ type: action, payload });
    },
    [dispatch]
  );

  return [currentState, send];
}
