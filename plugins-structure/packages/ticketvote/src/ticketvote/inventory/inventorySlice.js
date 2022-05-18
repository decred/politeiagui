import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import {
  getHumanReadableTicketvoteStatus,
  getTicketvoteStatusCode,
} from "../../lib/utils";
import { getTicketvoteError } from "../../lib/errors";
import {
  validateTicketvoteInventoryPageSize,
  validateTicketvoteStatus,
} from "../../lib/validation";

const initialStatusInventory = {
  tokens: [],
  lastPage: 0,
  lastTokenPos: null,
  status: "idle",
};

export const initialState = {
  unauthorized: initialStatusInventory,
  authorized: initialStatusInventory,
  started: initialStatusInventory,
  finished: initialStatusInventory,
  approved: initialStatusInventory,
  rejected: initialStatusInventory,
  ineligible: initialStatusInventory,
  error: null,
  bestBlock: 0,
  status: "idle",
};

// Thunks
export const fetchTicketvoteInventory = createAsyncThunk(
  "ticketvoteInventory/fetch",
  async ({ status, page = 1 }, { getState, rejectWithValue }) => {
    const statusCode = getTicketvoteStatusCode(status);
    try {
      const res = await api.fetchInventory(getState(), {
        status: statusCode,
        page,
      });
      const inventoryPageSize =
        getState().ticketvotePolicy.policy.inventorypagesize;
      return {
        inventory: res.vetted,
        bestBlock: res.bestblock,
        inventoryPageSize,
      };
    } catch (error) {
      const message = getTicketvoteError(error.body, error.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: ({ status }, { getState }) =>
      validateTicketvoteStatus(status) &&
      validateTicketvoteInventoryPageSize(getState()),
  }
);

// Reducer
const ticketvoteInventorySlice = createSlice({
  name: "ticketvoteInventory",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTicketvoteInventory.pending, (state, action) => {
        const { status } = action.meta.arg;
        const readableStatus = getHumanReadableTicketvoteStatus(status);
        state[readableStatus].status = "loading";
      })
      .addCase(fetchTicketvoteInventory.fulfilled, (state, action) => {
        const { inventory, inventoryPageSize } = action.payload;
        const { status, page } = action.meta.arg;
        const readableStatus = getHumanReadableTicketvoteStatus(status);
        if (inventory[readableStatus].length === inventoryPageSize) {
          state[readableStatus].status = "succeeded/hasMore";
        } else {
          state[readableStatus].status = "succeeded/isDone";
        }
        state[readableStatus].lastPage = page;
        state[readableStatus].tokens.push(...inventory[readableStatus]);
      })
      .addCase(fetchTicketvoteInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTicketvoteInventoryByStatus = (state, status) => {
  if (validateTicketvoteStatus(status)) {
    const readableStatus = getHumanReadableTicketvoteStatus(status);
    return state.ticketvoteInventory[readableStatus].tokens;
  }
};

export const selectTicketvoteInventoryStatus = (state, { status }) => {
  if (validateTicketvoteStatus(status)) {
    const readableStatus = getHumanReadableTicketvoteStatus(status);
    return state.ticketvoteInventory[readableStatus].status;
  }
};

export const selectTicketvoteInventoryLastPage = (state, { status }) => {
  if (validateTicketvoteStatus(status)) {
    // We have valids record state and status.
    // Convert them to strings if they are not.
    const readableStatus = getHumanReadableTicketvoteStatus(status);
    return state.ticketvoteInventory[readableStatus].lastPage;
  }
};

// Error
export const selectTicketvoteInventoryError = (state) =>
  state.ticketvoteInventory.error;

// Export default reducer
export default ticketvoteInventorySlice.reducer;
