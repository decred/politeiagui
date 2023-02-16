import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "./client/client";
import { pki } from "./pki";
import recordsInventoryReducer from "./records/inventory/recordsInventorySlice";
import recordsReducer from "./records/records/recordsSlice";
import recordsDraftsReducer from "./records/drafts/recordsDraftsSlice";
import policyReducer from "./records/policy/policySlice";
import recordsTimestampsReducer from "./records/timestamps/timestampsSlice";
import apiReducer from "./api/apiSlice";
import apiPolicyReducer from "./api/policySlice";
import progressReducer from "./globalServices/progress";
import messageReducer from "./globalServices/message";
import navigationReducer from "./globalServices/navigation";
// User layer
import userReducer from "./user/userSlice"; // TODO: Remove this.
import userAuthReducer from "./user/auth/userAuthSlice";
import userPaymentsReducer from "./user/payments/userPaymentsSlice";
import usersReducer from "./user/users/usersSlice";

import { listenerMiddleware } from "./listeners";

// Define the Reducers that will always be present in the application
const staticReducers = {
  api: apiReducer,
  apiPolicy: apiPolicyReducer,
  recordsInventory: recordsInventoryReducer,
  records: recordsReducer,
  recordsDrafts: recordsDraftsReducer,
  recordsPolicy: policyReducer,
  recordsTimestamps: recordsTimestampsReducer,
  globalProgress: progressReducer,
  globalMessage: messageReducer,
  globalNavigation: navigationReducer,
  user: userReducer, // TODO: Remove this reducer when the user layer is done.
  userAuth: userAuthReducer,
  users: usersReducer,
  userPayments: userPaymentsReducer,
};

function createReducer(reducers, asyncReducers) {
  return combineReducers({
    ...reducers,
    ...asyncReducers,
  });
}

// Configure the store
export function configureCustomStore({
  initialState,
  reducers = staticReducers,
  extraArgument = { ...client, pki },
} = {}) {
  const store = configureStore(
    {
      reducer: { ...reducers },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          // This will make the client available in the 'extra' argument
          // for all our thunks created with createAsyncThunk
          thunk: {
            extraArgument,
          },
        }).concat([listenerMiddleware]),
    },
    initialState
  );

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {};

  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  // Useful for plugins to create new reducers
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(reducers, store.asyncReducers));
  };

  // Return the modified store
  return store;
}

export const store =
  process.env.NODE_ENV === "test" ? {} : configureCustomStore();
