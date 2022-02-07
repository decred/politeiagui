import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import reducer, {
  fetchTicketvoteTimestamps,
  fetchTicketvoteTimestampsFirstPage,
  initialState,
} from "./timestampsSlice";
import policyReducer from "../policy/policySlice";

describe("Given the timestampsSlice", () => {
  let store;
  // spy on the method used to fetch
  let fetchTimestampsSpy;
  const mockAuthDetails = {
    auths: [
      {
        data: "Auths",
      },
    ],
    details: {
      data: "tokens",
    },
  };
  const mockVotes = { votes: Array(100).fill({ data: "vote" }) };
  const mockVotesIncompletePage = { votes: Array(20).fill({ data: "vote" }) };
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({
      reducer: {
        ticketvoteTimestamps: reducer,
        ticketvotePolicy: policyReducer,
      },
      preloadedState: {
        ticketvotePolicy: {
          policy: {
            timestampspagesize: 100,
          },
        },
      },
    });
    fetchTimestampsSpy = jest.spyOn(api, "fetchTimestamps");
  });
  afterEach(() => {
    fetchTimestampsSpy.mockRestore();
  });
  describe("when given parameters are empty", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });
  describe("when invalid token is passed to fetchTicketvoteTimestamps", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchTicketvoteTimestamps(invalidParams));
      expect(fetchTimestampsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("idle");
    });
  });
  describe("when fetchTicketvoteTimestamps dispatches without policy", () => {
    it("should update the status to failed and log error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      store = configureStore({ reducer: { ticketvoteTimestamps: reducer } });

      await store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));
      expect(fetchTimestampsSpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("failed");

      consoleErrorSpy.mockRestore();
    });
  });
  describe("when fetchTicketvoteTimestamps dispatches with valid params", () => {
    it("should update the status to loading", () => {
      store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteTimestamps is called with votesPage, without auth and details fetched", () => {
    it("should log error and update the state to failed", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      await store.dispatch(
        fetchTicketvoteTimestamps({ token: "fakeToken", votesPage: 1 })
      );

      expect(fetchTimestampsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("failed");

      consoleErrorSpy.mockRestore();
    });
  });
  describe("when fetchTicketvoteTimestamps succeeds", () => {
    it("should update byToken and status to succeeded/needsVotes if votesPage is undefined", async () => {
      fetchTimestampsSpy.mockResolvedValueOnce(mockAuthDetails);

      await store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({
        fakeToken: mockAuthDetails,
      });
      expect(state.ticketvoteTimestamps.status).toEqual("succeeded/needsVotes");
    });
  });
  describe("when fetchTicketvoteTimestamps succeeds with votesPage", () => {
    beforeEach(() => {
      store = configureStore({
        reducer: {
          ticketvoteTimestamps: reducer,
          ticketvotePolicy: policyReducer,
        },
        preloadedState: {
          ticketvotePolicy: {
            policy: {
              timestampspagesize: 100,
            },
          },
          ticketvoteTimestamps: {
            byToken: { fakeToken: mockAuthDetails },
            status: "succeeded/needsVotes",
          },
        },
      });
    });
    it("should include votes and update status (succeeded/hasMore if votes.length == timestampspagesize)", async () => {
      fetchTimestampsSpy.mockResolvedValueOnce(mockVotes);

      await store.dispatch(
        fetchTicketvoteTimestamps({ token: "fakeToken", votesPage: 1 })
      );
      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({
        fakeToken: { ...mockAuthDetails, ...mockVotes },
      });
      expect(state.ticketvoteTimestamps.status).toEqual("succeeded/hasMore");
    });
    it("should include votes and update status (succeeded/isDone if votes.length != timestampspagesize)", async () => {
      fetchTimestampsSpy.mockResolvedValueOnce(mockVotesIncompletePage);

      await store.dispatch(
        fetchTicketvoteTimestamps({ token: "fakeToken", votesPage: 2 })
      );
      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({
        fakeToken: { ...mockAuthDetails, ...mockVotesIncompletePage },
      });
      expect(state.ticketvoteTimestamps.status).toEqual("succeeded/isDone");
    });
  });
  describe("when fetchTicketvoteTimestamps fails", () => {
    it("should dispatch failure and update the error", async () => {
      const error = new Error("ERROR");
      fetchTimestampsSpy.mockRejectedValue(error);

      await store.dispatch(fetchTicketvoteTimestamps({ token: "fakeToken" }));

      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.status).toEqual("failed");
      expect(state.ticketvoteTimestamps.error).toEqual("ERROR");
    });
  });
  describe("when invalid token is passed to fetchTicketvoteTimestampsFirstPage", () => {
    it("should not fetch nor fire actions", async () => {
      const invalidParams = {};

      await store.dispatch(fetchTicketvoteTimestampsFirstPage(invalidParams));
      expect(fetchTimestampsSpy).not.toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("idle");
    });
  });
  describe("when fetchTicketvoteTimestampsFirstPage dispatches without policy", () => {
    it("should update the status to failed and log error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      store = configureStore({ reducer: { ticketvoteTimestamps: reducer } });

      await store.dispatch(
        fetchTicketvoteTimestampsFirstPage({ token: "fakeToken" })
      );
      expect(fetchTimestampsSpy).not.toBeCalled();
      expect(consoleErrorSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("failed");

      consoleErrorSpy.mockRestore();
    });
  });
  describe("when fetchTicketvoteTimestampsFirstPage dispatches with valid params", () => {
    let consoleErrorSpy;
    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
    });
    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });
    it("should update the status to loading", () => {
      store.dispatch(
        fetchTicketvoteTimestampsFirstPage({ token: "fakeToken" })
      );
      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({});
      expect(state.ticketvoteTimestamps.status).toEqual("loading");
    });
  });
  describe("when fetchTicketvoteTimestampsFirstPage succeeds", () => {
    it("should update the status to succeeded/hasMore if first page length is 100", async () => {
      fetchTimestampsSpy
        .mockResolvedValueOnce(mockAuthDetails)
        .mockResolvedValueOnce(mockVotes);

      await store.dispatch(
        fetchTicketvoteTimestampsFirstPage({ token: "fakeToken" })
      );
      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({
        fakeToken: { ...mockAuthDetails, ...mockVotes },
      });
      expect(state.ticketvoteTimestamps.status).toEqual("succeeded/hasMore");
    });
    it("should update the status to succeeded/isDone if first page length is < 100", async () => {
      fetchTimestampsSpy
        .mockResolvedValueOnce(mockAuthDetails)
        .mockResolvedValueOnce(mockVotesIncompletePage);

      await store.dispatch(
        fetchTicketvoteTimestampsFirstPage({ token: "fakeToken" })
      );
      expect(fetchTimestampsSpy).toBeCalled();
      const state = store.getState();
      expect(state.ticketvoteTimestamps.byToken).toEqual({
        fakeToken: { ...mockAuthDetails, ...mockVotesIncompletePage },
      });
      expect(state.ticketvoteTimestamps.status).toEqual("succeeded/isDone");
    });
  });
});
