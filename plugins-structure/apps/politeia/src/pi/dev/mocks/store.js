import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { getTokensArray, mockRecordsBatch } from "@politeiagui/core/dev/mocks";
import { mockPiSummaries, mockProposal } from "./";
import {
  mockTicketvoteSummaries,
  ticketvoteSummariesByStatus,
} from "@politeiagui/ticketvote/dev/mocks";
import { mockCommentsCount } from "@politeiagui/comments/dev/mocks";

const BATCH_PAGE_SIZE = 5;
const INVENTORY_PAGE_SIZE = 20;

const initialState = {
  records: { records: {} },
  commentsCount: { byToken: {} },
  piSummaries: { byToken: {} },
  ticketvoteSummaries: { byToken: {} },
  piProposals: { statusChangesByToken: {} },
  inventory: getTokensArray(INVENTORY_PAGE_SIZE),
  inventoryStatus: "succeeded/hasMore",
  batchStatus: "idle",
};

function getRecordsRequestsParam(tokens = []) {
  return tokens.map((token) => ({
    token,
    filenames: ["proposalmetadata.json"],
  }));
}
function getTokensBatch(inventory, records) {
  const tokens = [];
  let i = 0;
  for (const token of inventory) {
    if (i >= BATCH_PAGE_SIZE) break;
    if (!records[token]) {
      tokens.push(token);
      i++;
    }
  }
  return tokens;
}

function mockNextBatch(tokens = []) {
  const requests = getRecordsRequestsParam(tokens);
  const records = mockRecordsBatch(mockProposal({ state: 2, status: 2 }))({
    requests,
  }).records;
  const voteSummaries = mockTicketvoteSummaries(
    ticketvoteSummariesByStatus.unauthorized
  )({ tokens }).summaries;
  const proposalSummaries = mockPiSummaries({ status: "under-review" })({
    tokens,
  }).summaries;
  const counts = mockCommentsCount()({ tokens }).counts;
  return { records, voteSummaries, proposalSummaries, counts };
}

const onFetchNextBatch = createAsyncThunk(
  "fetchNextBatch",
  async (_, { getState }) => {
    const state = getState();
    const tokens = getTokensBatch(state.inventory, state.records.records);
    const { records, voteSummaries, proposalSummaries, counts } =
      mockNextBatch(tokens);
    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve({ records, voteSummaries, proposalSummaries, counts, tokens });
      }, 100)
    );
  }
);

const onFetchNextInventoryPage = createAsyncThunk("fetchNextPage", async () => {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve({ tokens: getTokensArray(INVENTORY_PAGE_SIZE) });
    }, 100)
  );
});

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    onFetchDone(state) {
      return state;
    },
    clear() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(onFetchNextInventoryPage.pending, (state) => {
        state.inventoryStatus = "loading";
      })
      .addCase(onFetchNextInventoryPage.fulfilled, (state, action) => {
        state.inventory.push(...action.payload.tokens);
        if (state.inventory.length >= 3 * INVENTORY_PAGE_SIZE) {
          state.inventoryStatus = "succeeded/isDone";
        } else {
          state.inventoryStatus = "succeeded/hasMore";
        }
      })
      .addCase(onFetchNextBatch.pending, (state) => {
        state.batchStatus = "loading";
      })
      .addCase(onFetchNextBatch.fulfilled, (state, action) => {
        const { records, counts, voteSummaries, proposalSummaries, tokens } =
          action.payload;
        for (const token of tokens) {
          state.records.records[token] = records[token];
          state.commentsCount.byToken[token] = counts[token];
          state.ticketvoteSummaries.byToken[token] = voteSummaries[token];
          state.piSummaries.byToken[token] = proposalSummaries[token];
        }
        state.batchStatus = "succeeded";
      });
  },
});

export const asyncActions = { onFetchNextBatch, onFetchNextInventoryPage };
export const { actions } = slice;

export const store = configureStore({
  reducer: slice.reducer,
});

export const withDispatch = (fn) => () => {
  return store.dispatch(fn());
};
