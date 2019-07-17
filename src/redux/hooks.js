import React, { useState, useMemo, useEffect, useContext } from "react";
import { bindActionCreators } from "redux";
import { selectorMap } from "src/selectors";

export const reduxContext = React.createContext();
export const useReduxContext = () => useContext(reduxContext);

export function useRedux(ownProps, mapStateToProps, mapDispatchToProps) {
  const { store: redux } = useReduxContext();

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

  useEffect(() => redux.subscribe(() => setState(redux.getState())));

  return useMemo(() => ({ ...computedState, ...boundActions }), [
    computedState,
    boundActions
  ]);
}
