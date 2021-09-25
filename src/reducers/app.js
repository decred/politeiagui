import * as act from "../actions/types";

export const DEFAULT_STATE = {
  init: {},
  policy: {},
  keyMismatch: false,
  draftProposals: null,
  draftInvoices: null,
  draftDccs: null,
  csrfIsNeeded: null,
  shouldVerifyKey: false,
  identityImportResult: { errorMsg: "", successMsg: "" },
  pollingCreditsPayment: false,
  reachedCreditsPaymentPollingLimit: false,
  proposalPaymentReceived: false
};

const app = (state = DEFAULT_STATE, action) =>
  ((
    {
      [act.RECEIVE_INIT_SESSION]: () =>
        action.error
          ? state
          : {
              ...state,
              init: action.payload
            },
      [act.RECEIVE_POLICY]: () =>
        action.error
          ? state
          : {
              ...state,
              policy: action.payload
            },
      [act.KEY_MISMATCH]: () => ({
        ...state,
        keyMismatch: action.payload
      }),
      [act.SAVE_DRAFT_PROPOSAL]: () => {
        const newDraftProposals = state.draftProposals;
        const draftId = action.payload.id;
        return {
          ...state,
          draftProposals: {
            ...newDraftProposals,
            newDraft: true,
            lastSubmitted: action.payload.name,
            [draftId]: {
              ...action.payload,
              draftId
            }
          }
        };
      },
      [act.DELETE_DRAFT_PROPOSAL]: () => {
        const draftId = action.payload;
        if (!state.draftProposals[draftId]) {
          return state;
        }
        const newDraftProposals = state.draftProposals;
        delete newDraftProposals[draftId];
        return { ...state, draftProposals: newDraftProposals };
      },
      [act.LOAD_DRAFT_PROPOSALS]: () => ({
        ...state,
        draftProposals: action.payload
      }),

      [act.SAVE_DRAFT_INVOICE]: () => {
        const newDraftInvoices = state.draftInvoices;
        const draftId = action.payload.id;
        return {
          ...state,
          draftInvoices: {
            ...newDraftInvoices,
            newDraft: true,
            lastSubmitted: action.payload.name,
            [draftId]: {
              ...action.payload,
              draftId
            }
          }
        };
      },
      [act.DELETE_DRAFT_INVOICE]: () => {
        const draftId = action.payload;
        if (!state.draftInvoices[draftId]) {
          return state;
        }
        const newDraftInvoices = state.draftInvoices;
        delete newDraftInvoices[draftId];
        return { ...state, draftInvoices: newDraftInvoices };
      },
      [act.LOAD_DRAFT_INVOICES]: () => ({
        ...state,
        draftInvoices: action.payload
      }),
      [act.SAVE_DRAFT_DCC]: () => {
        const newDraftDccs = state.draftDccs;
        const draftId = action.payload.id;
        return {
          ...state,
          draftDccs: {
            ...newDraftDccs,
            newDraft: true,
            lastSubmitted: draftId,
            [draftId]: {
              ...action.payload,
              draftId
            }
          }
        };
      },
      [act.DELETE_DRAFT_DCC]: () => {
        const draftId = action.payload;
        if (!state.draftDccs[draftId]) {
          return state;
        }
        const newDraftDccs = state.draftDccs;
        delete newDraftDccs[draftId];
        return { ...state, draftDccs: newDraftDccs };
      },
      [act.LOAD_DRAFT_DCCS]: () => ({
        ...state,
        draftDccs: action.payload
      }),
      [act.CSRF_NEEDED]: () => ({
        ...state,
        init: { ...state.init, csrfToken: null }
      }),
      [act.SHOULD_AUTO_VERIFY_KEY]: () => ({
        ...state,
        shouldVerifyKey: action.payload
      }),
      [act.IDENTITY_IMPORTED]: () => ({
        ...state,
        identityImportResult: action.payload
      }),
      [act.TOGGLE_CREDITS_PAYMENT_POLLING]: () => ({
        ...state,
        pollingCreditsPayment: action.payload
      }),
      [act.TOGGLE_CREDITS_PAYMENT_POLLING_REACHED_LIMIT]: () => ({
        ...state,
        reachedCreditsPaymentPollingLimit: action.payload
      }),
      [act.TOGGLE_PROPOSAL_PAYMENT_RECEIVED]: () => ({
        ...state,
        proposalPaymentReceived: action.payload
      }),
      [act.RECEIVE_LOGOUT]: () => ({
        ...DEFAULT_STATE,
        policy: state.policy
      }),
      [act.RECEIVE_CMS_LOGOUT]: () => ({
        ...DEFAULT_STATE,
        policy: state.policy
      })
    }[action.type] || (() => state)
  )());

export default app;
