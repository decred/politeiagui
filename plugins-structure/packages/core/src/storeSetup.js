import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "./client/client";
import recordsInventoryReducer from "./records/inventory/recordsInventorySlice";
import recordsReducer from "./records/records/recordsSlice";
import policyReducer from "./records/policy/policySlice";
import recordsTimestampsReducer from "./records/timestamps/timestampsSlice";
import apiReducer from "./api/apiSlice";

// Define the Reducers that will always be present in the application
const staticReducers = {
  api: apiReducer,
  recordsInventory: recordsInventoryReducer,
  records: recordsReducer,
  recordsPolicy: policyReducer,
  recordsTimestamps: recordsTimestampsReducer,
};

function createReducer(asyncReducers) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
}

// Configure the store
function configureCustomStore(initialState) {
  const store = configureStore(
    {
      reducer: { ...staticReducers },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          // This will make the client available in the 'extra' argument
          // for all our thunks created with createAsyncThunk
          thunk: {
            extraArgument: client,
          },
        }),
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
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  // Return the modified store
  return store;
}

export const store = configureCustomStore();
