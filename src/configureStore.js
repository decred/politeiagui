import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import { loadStateLocalStorage } from "./lib/local_storage";

const configureStore = preloadedState => {
  if (process.env.NODE_ENV === "production") {
    return createStore(
      rootReducer,
      {
        ...loadStateLocalStorage,
        ...preloadedState
      }
      ,
      compose(applyMiddleware(thunkMiddleware))
    );
  } else {
    const composeEnhancers =
    typeof window === "object" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose;

    if (process.env.REACT_APP_USE_REDUX_LOGGER) {
      const loggerMiddleware = createLogger();
      return createStore(
        rootReducer,
        {
          ...loadStateLocalStorage,
          ...preloadedState
        },
        composeEnhancers(applyMiddleware(
          thunkMiddleware,
          loggerMiddleware
        ))
      );
    } else {
      return createStore(
        rootReducer,
        {
          ...loadStateLocalStorage,
          ...preloadedState
        },
        composeEnhancers(applyMiddleware(
          thunkMiddleware
        ))
      );
    }
  }
};

export default configureStore;
