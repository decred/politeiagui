import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import { loadStateLocalStorage } from "./lib/local_storage";

const loggerMiddleware = createLogger();
const configureStore = preloadedState => {
  const composeEnhancers =
    typeof window === "object" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose;

  return createStore(
    rootReducer,
    {
      ...loadStateLocalStorage,
      ...preloadedState
    }
    ,
    composeEnhancers(applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    ))
  );
};

export default configureStore;
