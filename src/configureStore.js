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
      },
      compose(applyMiddleware(thunkMiddleware))
    );
  } else {
    const composeEnhancers =
      typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            trace: true
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose;
    const loggerMiddleware = createLogger();

    const middlewares = [
      thunkMiddleware,
      process.env.REACT_APP_USE_REDUX_LOGGER && loggerMiddleware
    ].filter(Boolean);

    return createStore(
      rootReducer,
      { ...loadStateLocalStorage, ...preloadedState },
      composeEnhancers(applyMiddleware(...middlewares))
    );
  }
};

export default configureStore;
