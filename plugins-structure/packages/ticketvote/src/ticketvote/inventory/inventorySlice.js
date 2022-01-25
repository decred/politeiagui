import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import {
  getHumanReadableTicketvoteStatus,
  getTicketvoteStatusCode,
} from "../../lib/utils";
import { validateTicketvoteStatus } from "../../lib/validation";
import { setFetchQueue } from "../summaries/summariesSlice";
import { RECORDS_PAGE_SIZE } from "@politeiagui/core";
import { records } from "@politeiagui/core/records";
import take from "lodash/fp/take";
import isEmpty from "lodash/fp/isEmpty";
import isArray from "lodash/fp/isArray";
import without from "lodash/fp/without";

const initialStatusInventory = {
  tokens: [],
  lastPage: 0,
  status: "idle",
};

const initialQueue = {
  status: "idle",
  tokens: [],
};

export const initialState = {
  unauthorized: initialStatusInventory,
  authorized: initialStatusInventory,
  started: initialStatusInventory,
  finished: initialStatusInventory,
  approved: initialStatusInventory,
  rejected: initialStatusInventory,
  ineligible: initialStatusInventory,
  recordsFetchQueue: initialQueue,
  error: null,
  bestBlock: 0,
  status: "idle",
};

// Thunks
export const fetchTicketvoteInventory = createAsyncThunk(
  "ticketvoteInventory/fetch",
  async ({ status, page = 1 }, { getState, dispatch, rejectWithValue }) => {
    const statusCode = getTicketvoteStatusCode(status);
    try {
      const res = await api.fetchInventory(getState(), {
        status: statusCode,
        page,
      });
      const readableStatus = getHumanReadableTicketvoteStatus(status);
      const tokens = res.vetted[readableStatus];
      dispatch(setFetchQueue({ tokens }));
      dispatch(pushRecordsFetchQueue({ tokens }));
      return { ...res.vetted, bestBlock: res.bestblock };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: ({ status }) => validateTicketvoteStatus(status),
  }
);

export const fetchTicketvoteNextRecordsPage = createAsyncThunk(
  "ticketvoteInventory/fetchNextRecordsPage",
  async (body = {}, { dispatch, getState, rejectWithValue }) => {
    try {
      let { pageSize } = body;
      if (!pageSize) pageSize = RECORDS_PAGE_SIZE;
      const queue = getState().ticketvoteInventory.recordsFetchQueue.tokens;
      const nextTokens = take(pageSize, queue);
      return await dispatch(records.fetch(nextTokens));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const queue = getState().ticketvoteInventory.recordsFetchQueue.tokens;
      return !isEmpty(queue);
    },
  }
);

// Reducer
const ticketvoteInventorySlice = createSlice({
  name: "ticketvoteInventory",
  initialState,
  reducers: {
    pushRecordsFetchQueue(state, action) {
      const { tokens } = action.payload;
      state.recordsFetchQueue.tokens = [
        ...state.recordsFetchQueue.tokens,
        ...tokens,
      ];
    },
    popRecordsFetchQueue(state) {
      if (isEmpty(state.recordsFetchQueue)) return;
      state.recordsFetchQueue.tokens.shift();
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTicketvoteInventory.pending, (state, action) => {
        const { status } = action.meta.arg;
        const readableStatus = getHumanReadableTicketvoteStatus(status);
        state[readableStatus].status = "loading";
      })
      .addCase(fetchTicketvoteInventory.fulfilled, (state, action) => {
        const inventory = action.payload;
        const { status, page } = action.meta.arg;
        const readableStatus = getHumanReadableTicketvoteStatus(status);
        if (inventory[readableStatus].length === 20) {
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
      })
      .addCase(fetchTicketvoteNextRecordsPage.pending, (state) => {
        state.recordsFetchQueue.status = "loading";
      })
      .addCase(fetchTicketvoteNextRecordsPage.fulfilled, (state, action) => {
        if (!action.payload) {
          state.recordsFetchQueue.status = "succeeded/isDone";
          return;
        }
        const recordsFetched = action.payload.meta.arg;
        const newQueue = without(
          recordsFetched,
          state.recordsFetchQueue.tokens
        );
        state.recordsFetchQueue.tokens = newQueue;
        state.recordsFetchQueue.status = isEmpty(newQueue)
          ? "succeeded/isDone"
          : "succeeded/hasMore";
      })
      .addCase(fetchTicketvoteNextRecordsPage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Actions - notice they have the same name than the properties on reducers
// that's because createSlice automatically generate action creators for us
export const { pushRecordsFetchQueue, popRecordsFetchQueue } =
  ticketvoteInventorySlice.actions;

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

export const selectTicketvoteRecordsQueueStatus = (state) =>
  state.ticketvoteInventory.recordsFetchQueue.status;

export const selectRecordsByTicketvoteStatus = (state, status) => {
  if (validateTicketvoteStatus(status)) {
    const tokens = selectTicketvoteInventoryByStatus(state, status);
    return records.selectByTokensBatch(state, tokens);
  }
};

export const selectRecordsByTicketvoteStatuses = (state, statuses) => {
  if (isArray(statuses)) {
    return statuses.reduce(
      (acc, status) => ({
        ...acc,
        [status]: selectRecordsByTicketvoteStatus(state, status),
      }),
      {}
    );
  }
};

// Error
export const selectTicketvoteInventoryError = (state) =>
  state.ticketvoteInventory.error;

// Export default reducer
export default ticketvoteInventorySlice.reducer;
