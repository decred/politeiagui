import app, { DEFAULT_STATE } from "../app";
import * as act from "../../actions/types";
import { TOP_LEVEL_COMMENT_PARENTID } from "../../lib/api";
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

  const assertReducerEqualsAssertion = (state, action, assertion) => {
    const newstate = app(state, action);

    expect(newstate).toEqual(assertion);
  };

  test("default tests for app reducer", () => {
    const action = {
      type: act.SET_REPLY_PARENT,
      payload: "parentid",
      error: false
    };

    let state = app({}, action);

    expect(state.replyParent).toEqual(action.payload);

    delete action.payload;

    state = app({}, action);

    expect(state.replyParent).toEqual(TOP_LEVEL_COMMENT_PARENTID);

    expect(app(undefined, { type: "" })).toEqual(DEFAULT_STATE);
  });

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
        draftId: "randomDraftId",
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
        draftId: "randomDraftId2",
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
        [action.payload.draftId]: action.payload
      }
    });

    state = app(state, action2);

    expect(state).toEqual({
      draftProposals: {
        newDraft: true,
        lastSubmitted: action2.payload.name,
        [action.payload.draftId]: action.payload,
        [action2.payload.draftId]: action2.payload
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

  test("correctly deals with proposal credit reducers", () => {
    const action = {
      type: act.SET_PROPOSAL_CREDITS,
      payload: 10,
      error: false
    };

    const state = app({}, action);

    expect(state).toEqual({ proposalCredits: action.payload });

    const action2 = {
      type: act.SUBTRACT_PROPOSAL_CREDITS,
      payload: 5,
      error: false
    };

    const state2 = app(state, action2);

    expect(state2).toEqual({
      proposalCredits: action.payload - action2.payload
    });

    const action3 = {
      type: act.SUBTRACT_PROPOSAL_CREDITS
    };

    expect(app(state2, action3)).toEqual(state2);

    const action4 = {
      type: act.SET_PROPOSAL_CREDITS
    };

    expect(app({}, action4)).toEqual({ proposalCredits: 0 });
  });

  test("add proposal credits", () => {
    const action = {
      type: act.ADD_PROPOSAL_CREDITS,
      payload: {
        amount: 5,
        txid: "ff0207a03b761cb409c7677c5b5521562302653d2236c92d016dd47e0ae37bf7"
      },
      error: false
    };

    const action2 = {
      type: act.ADD_PROPOSAL_CREDITS,
      payload: {
        amount: 10,
        txid: "ff0207a03b761cb409c7677c5b5521562302653d2236c92d016dd47e0ae37bf8"
      },
      error: false
    };

    const state = app({ proposalCredits: 0 }, action);

    expect(state).toEqual({
      proposalCredits: action.payload.amount,
      recentPayments: [action.payload]
    });

    const state2 = app(
      {
        proposalCredits: 5,
        recentPayments: [
          {
            amount: 5,
            txid:
              "ff0207a03b761cb409c7677c5b5521562302653d2236c92d016dd47e0ae37bf7"
          }
        ]
      },
      action2
    );

    expect(state2).toEqual({
      proposalCredits: 5 + action2.payload.amount,
      recentPayments: [
        {
          amount: 5,
          txid:
            "ff0207a03b761cb409c7677c5b5521562302653d2236c92d016dd47e0ae37bf7"
        },
        action2.payload
      ]
    });
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

  test("correctly sets votes end height", () => {
    const action = {
      type: act.SET_VOTES_END_HEIGHT,
      payload: {
        token: "epicproposal",
        endheight: 2
      },
      error: false
    };

    const state = app({}, action);

    expect(state).toEqual({
      votesEndHeight: {
        [action.payload.token]: action.payload.endheight
      }
    });
  });

  test("correctly test simpler reducers with assertion", () => {
    const reducers = [
      {
        action: act.REQUEST_SIGNUP_CONFIRMATION,
        assertion: { isShowingSignupConfirmation: true }
      },
      {
        action: act.RESET_SIGNUP_CONFIRMATION,
        assertion: { isShowingSignupConfirmation: false }
      },
      { action: act.SET_ONBOARD_AS_VIEWED, assertion: { onboardViewed: true } }
    ];

    reducers.map(obj => {
      const action = {
        type: obj.action,
        payload: {},
        error: false
      };

      assertReducerEqualsAssertion({}, action, obj.assertion);
    });
  });

  test("reset redirectFrom action", () => {
    const action = {
      type: act.RESET_REDIRECTED_FROM
    };

    const state = app({}, action);

    expect(state).toEqual({
      redirectedFrom: null
    });
  });

  test("correctly test reducers that only sets payload to informed key", () => {
    const reducers = [
      { action: act.LOAD_DRAFT_PROPOSALS, key: "draftProposals" },
      { action: act.SET_PROPOSAL_APPROVED, key: "isProposalStatusApproved" },
      { action: act.CHANGE_ADMIN_FILTER_VALUE, key: "adminProposalsShow" },
      { action: act.CHANGE_PUBLIC_FILTER_VALUE, key: "publicProposalsShow" },
      { action: act.CHANGE_USER_FILTER_VALUE, key: "userProposalsShow" },
      { action: act.CSRF_NEEDED, key: "csrfIsNeeded" },
      { action: act.SHOULD_AUTO_VERIFY_KEY, key: "shouldVerifyKey" },
      { action: act.IDENTITY_IMPORTED, key: "identityImportResult" },
      { action: act.SET_COMMENTS_SORT_OPTION, key: "commentsSortOption" },
      {
        action: act.TOGGLE_CREDITS_PAYMENT_POLLING,
        key: "pollingCreditsPayment"
      },
      { action: act.REDIRECTED_FROM, key: "redirectedFrom" }
    ];

    reducers.map(obj => {
      const act = {
        type: obj.action,
        payload: { data: "any" },
        error: false
      };
      assertKeyEqualsPayload({}, act, obj.key);
    });
  });
});
