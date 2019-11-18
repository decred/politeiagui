import React, { useState, useMemo, useEffect, useContext } from "react";
import { bindActionCreators } from "redux";
import { selectorMap } from "src/selectors";
import { createSelectorHook } from "react-redux";
import throttle from "lodash/throttle";

export const reduxContext = React.createContext();
export const useReduxContext = () => useContext(reduxContext);

export const useSelector = createSelectorHook(reduxContext);

const DEFAULT_MAP_DISPATCH = {};

export function useRedux(
  ownProps,
  mapStateToProps,
  mapDispatchToProps = DEFAULT_MAP_DISPATCH
) {
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

export const useStoreSubscribe = callbackFn => {
  const { store } = useReduxContext();
  return store.subscribe(
    throttle(() => {
      const state = store.getState();
      callbackFn(state);
    }, 1000)
  );
};
