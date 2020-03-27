import app from "../app";
import * as act from "../../actions/types";
import { PAYWALL_STATUS_PAID } from "../../constants";

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

  test("correctly updates state for receiving new proposals", () => {
    const act1 = {
      type: act.RECEIVE_NEW_PROPOSAL,
      payload: {
        censorshiprecord: {
          token: "tok"
        },
        data: "dat"
      },
      error: false
    };

    let state = app(MOCK_STATE, act1);

    expect(state).toEqual({
      ...MOCK_STATE,
      submittedProposals: {
        lastSubmitted: act1.payload.censorshiprecord.token,
        [act1.payload.censorshiprecord.token]: act1.payload
      }
    });

    const act2 = {
      ...act1,
      payload: {
        censorshiprecord: {
          token: "tok2"
        }
      }
    };

    state = app(state, act2);

    expect(state).toEqual({
      ...MOCK_STATE,
      submittedProposals: {
        lastSubmitted: act2.payload.censorshiprecord.token,
        [act2.payload.censorshiprecord.token]: act2.payload,
        [act1.payload.censorshiprecord.token]: act1.payload
      }
    });

    const act3 = {
      ...act1,
      error: true
    };

    expect(app(MOCK_STATE, act3)).toEqual(MOCK_STATE);
  });

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

  test("correctly set proposal status", () => {
    const action = {
      type: act.REQUEST_SETSTATUS_PROPOSAL,
      payload: {
        token: "draft",
        status: "reviewing"
      },
      error: false
    };

    const state = {
      ...MOCK_STATE,
      submittedProposals: {
        draft: {
          status: "pending"
        }
      }
    };

    const newstate = app(state, action);

    expect(newstate).toEqual({
      ...MOCK_STATE,
      submittedProposals: {
        draft: {
          status: action.payload.status
        }
      }
    });

    action.payload.token = "random";

    expect(app(state, action)).toEqual(state);

    action.error = true;

    expect(app(state, action)).toEqual(state);
  });

  test("correctly updates paywall status", () => {
    const action = {
      type: act.UPDATE_USER_PAYWALL_STATUS,
      payload: {
        status: 0,
        currentNumberOfConfirmations: 0
      },
      error: false
    };

    const state = app({}, action);

    expect(state).toEqual({
      userPaywallStatus: action.payload.status,
      userAlreadyPaid: action.payload.status === PAYWALL_STATUS_PAID,
      userPaywallConfirmations: action.payload.currentNumberOfConfirmations
    });
  });

  test("correctly test reducers that only sets payload to informed key", () => {
    const reducers = [
      { action: act.LOAD_DRAFT_PROPOSALS, key: "draftProposals" },
      { action: act.CSRF_NEEDED, key: "csrfIsNeeded" },
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
});
