import app from "../app";
import * as act from "../../actions/types";

describe("test app reducer", () => {
  const MOCK_STATE = {
    draftProposals: {
      newDraft: true,
      lastSubmitted: "draft",
      draft: {
        name: "draft",
        description: "Description",
        files: [],
        timestamp: Date.now() / 1000
      }
    }
  };

  const assertKeyEqualsPayload = (state, action, key) => {
    const newstate = app(state, action);

    expect(newstate).toEqual({
      [key]: action.payload
    });
  };

  test("correctly saves or overwrites draft proposals to state", () => {
    const action = {
      type: act.SAVE_DRAFT_PROPOSAL,
      payload: {
        name: "draft",
        id: "randomDraftId",
        description: "Description",
        files: [],
        timestamp: Date.now() / 1000
      },
      error: false
    };

    const action2 = {
      type: act.SAVE_DRAFT_PROPOSAL,
      payload: {
        name: "draft2",
        id: "randomDraftId2",
        description: "Description",
        files: [],
        timestamp: Date.now() / 1000
      },
      error: false
    };

    let state = app({}, action);

    state = app(state, action);

    expect(state).toEqual({
      draftProposals: {
        newDraft: true,
        lastSubmitted: action.payload.name,
        [action.payload.id]: {
          ...action.payload,
          draftId: action.payload.id
        }
      }
    });

    state = app(state, action2);

    expect(state).toEqual({
      draftProposals: {
        newDraft: true,
        lastSubmitted: action2.payload.name,
        [action.payload.id]: {
          ...action.payload,
          draftId: action.payload.id
        },
        [action2.payload.id]: {
          ...action2.payload,
          draftId: action2.payload.id
        }
      }
    });
  });

  test("correctly deletes draft proposal from state by name", () => {
    const action = {
      type: act.DELETE_DRAFT_PROPOSAL,
      payload: "draft",
      error: false
    };

    const state = app(MOCK_STATE, action);

    expect(state).toEqual({
      draftProposals: {
        newDraft: true,
        lastSubmitted: "draft"
      }
    });

    expect(app(state, action)).toEqual(state);
  });

  test("correctly test reducers that only sets payload to informed key", () => {
    const reducers = [
      { action: act.LOAD_DRAFT_PROPOSALS, key: "draftProposals" },
      { action: act.SHOULD_AUTO_VERIFY_KEY, key: "shouldVerifyKey" },
      { action: act.IDENTITY_IMPORTED, key: "identityImportResult" },
      {
        action: act.TOGGLE_CREDITS_PAYMENT_POLLING,
        key: "pollingCreditsPayment"
      }
    ];

    reducers.map((obj) => {
      const act = {
        type: obj.action,
        payload: { data: "any" },
        error: false
      };
      assertKeyEqualsPayload({}, act, obj.key);
    });
  });

  test("correctly deletes csrf token when required", () => {
    const action = {
      type: act.CSRF_NEEDED,
      payload: { data: "any" },
      error: false
    };
    expect(app({ init: {} }, action)).toEqual({ init: { csrfToken: null } });
  });
});
