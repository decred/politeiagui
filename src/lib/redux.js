import React, { useState, useEffect } from "react";
import { useApp } from "../App";
import { useMemo } from "react";
import { bindActionCreators } from "redux";
import { selectorMap } from "../selectors";

export function useRedux(ownProps, mapStateToProps, mapDispatchToProps = {}) {
  const { redux } = useApp();
  const [state, setState] = useState(redux.getState());
  const dispatch = redux.dispatch;
  const selector = useMemo(() => selectorMap(mapStateToProps), [
    mapStateToProps
  ]);
  const computedState = useMemo(() => selector(state, ownProps), [
    selector,
    state,
    ownProps
  ]);
  const boundActions = useMemo(
    () => bindActionCreators(mapDispatchToProps, dispatch),
    [mapDispatchToProps, dispatch]
  );

  useEffect(() => redux.subscribe(() => setState(redux.getState())), []);

  return useMemo(() => ({ ...computedState, ...boundActions }), [
    computedState,
    boundActions
  ]);
}

export function reduxHook(mapStateToProps, mapDispatchToProps) {
  return props => useRedux(props, mapStateToProps, mapDispatchToProps);
}

// Used for compatibility with redux connectors for transition purposes
export const makeHookConnector = useHook => Component => props => (
  <Component {...props} {...useHook(props)} />
);
