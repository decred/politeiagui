import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../reducers";

const getComposer = () => {
  const isProductionEnv = process.env.NODE_ENV === "production";
  const browserHasReduxDevTools =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  if (!isProductionEnv && browserHasReduxDevTools) {
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    });
  }

  return compose;
};

const getMiddlewares = () => {
  const middlewares = [thunkMiddleware];

  return middlewares;
};

const configureStore = (preloadedState = {}) => {
  const composeEnhancers = getComposer();
  const middlewares = getMiddlewares();
  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

export default configureStore;
