import React, { useMemo, useContext } from "react";
import { bindActionCreators } from "redux";
import { createSelectorHook, createDispatchHook } from "react-redux";
import throttle from "lodash/throttle";

export const reduxContext = React.createContext();
export const useReduxContext = () => useContext(reduxContext);

export const useSelector = createSelectorHook(reduxContext);
export const useDispatch = createDispatchHook(reduxContext);

export function useAction(action) {
  const dispatch = useDispatch();
  const boundAction = useMemo(
    () => bindActionCreators(action, dispatch),
    [action, dispatch]
  );
  return boundAction;
}

export const useStoreSubscribe = (callbackFn) => {
  const { store } = useReduxContext();
  return store.subscribe(
    throttle(() => {
      const state = store.getState();
      callbackFn(state);
    }, 1000)
  );
};
