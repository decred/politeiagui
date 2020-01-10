import * as act from "../actions/types";
import {
  FILTER_ALL_MONTHS,
  PAYWALL_STATUS_PAID,
  PROPOSAL_FILTER_ALL,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_USER_FILTER_SUBMITTED,
  SORT_BY_TOP
} from "../constants";
import { getCurrentYear, getCurrentMonth } from "../helpers";
import { TOP_LEVEL_COMMENT_PARENTID } from "../lib/api";

export const DEFAULT_STATE = {
  isShowingSignupConfirmation: false,
  replyParent: TOP_LEVEL_COMMENT_PARENTID,
  newProposal: {
    name: "",
    description: ""
  },
  replyThreadTree: {},
  adminProposalsShow: PROPOSAL_STATUS_UNREVIEWED,
  publicProposalsShow: PROPOSAL_FILTER_ALL,
  userProposalsShow: PROPOSAL_USER_FILTER_SUBMITTED,
  proposalCredits: 0,
  recentPayments: [],
  submittedProposals: {},
  draftProposals: null,
  identityImportResult: { errorMsg: "", successMsg: "" },
  onboardViewed: false,
  commentsSortOption: { value: SORT_BY_TOP, label: SORT_BY_TOP },
  pollingCreditsPayment: false,
  reachedCreditsPaymentPollingLimit: false,
  redirectedFrom: null,
  invoiceSortOption: { month: FILTER_ALL_MONTHS, year: getCurrentYear().year },
  endPayoutOption: { month: getCurrentMonth(), year: getCurrentYear().year },
  startPayoutOption: {
    month: getCurrentMonth() - 1,
    year: getCurrentYear().year
  },
  draftInvoices: null,
  draftDCCs: null
};

const app = (state = DEFAULT_STATE, action) =>
  ((
    {
      [act.SET_REPLY_PARENT]: () => ({
        ...state,
        replyParent: action.payload || TOP_LEVEL_COMMENT_PARENTID
      }),
      [act.RECEIVE_NEW_PROPOSAL]: () =>
        action.error
          ? state
          : {
              ...state,
              submittedProposals: {
                ...state.submittedProposals,
                lastSubmitted: action.payload.censorshiprecord.token,
                [action.payload.censorshiprecord.token]: action.payload
              }
            },
      [act.RECEIVE_NEW_THREAD_COMMENT]: () => {
        const {
          id,
          comment: { parentid, commentid }
        } = action.payload;
        const tree = state.replyThreadTree[id];
        if (tree) {
          const parentBranch = tree[parentid];
          const updatedParentBranch = parentBranch
            ? [...parentBranch, commentid]
            : [commentid];
          return {
            ...state,
            replyThreadTree: {
              ...state.replyThreadTree,
              [id]: {
                ...state.replyThreadTree[id],
                [parentid]: updatedParentBranch
              }
            }
          };
        }
        return {
          ...state,
          replyThreadTree: {
            ...state.replyThreadTree,
            [id]: {
              ...state.replyThreadTree[id],
              [parentid]: [commentid]
            }
          }
        };
      },
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
      [act.REQUEST_SETSTATUS_PROPOSAL]: () => {
        if (action.error) return state;
        const { status, token } = action.payload;
        if (!(token in state.submittedProposals)) return state;
        else {
          return {
            ...state,
            submittedProposals: {
              ...state.submittedProposals,
              [token]: {
                ...state.submittedProposals[token],
                status
              }
            }
          };
        }
      },
      [act.SAVE_DRAFT_DCC]: () => {
        const newDraftDCCs = state.draftDCCs;
        const draftId = action.payload.id;
        return {
          ...state,
          draftDCCs: {
            ...newDraftDCCs,
            newDraft: true,
            [draftId]: {
              ...action.payload,
              draftId
            }
          }
        };
      },
      [act.DELETE_DRAFT_DCC]: () => {
        const draftId = action.payload;
        if (!state.draftDCCs[draftId]) {
          return state;
        }
        const newDraftDCCs = state.draftDCCs;
        delete newDraftDCCs[draftId];
        return { ...state, draftDCCs: newDraftDCCs };
      },
      [act.LOAD_DRAFT_DCCS]: () => ({
        ...state,
        draftDCCs: action.payload
      }),
      [act.REQUEST_SETSTATUS_PROPOSAL]: () => {
        if (action.error) return state;
        const { status, token } = action.payload;
        if (!(token in state.submittedProposals)) return state;
        else {
          return {
            ...state,
            submittedProposals: {
              ...state.submittedProposals,
              [token]: {
                ...state.submittedProposals[token],
                status
              }
            }
          };
        }
      },
      [act.RESET_LAST_SUBMITTED]: () => ({
        ...state,
        submittedProposals: {
          ...state.submittedProposals,
          lastSubmitted: false
        }
      }),
      [act.SET_PROPOSAL_APPROVED]: () => ({
        ...state,
        isProposalStatusApproved: action.payload
      }),
      [act.SET_VOTES_END_HEIGHT]: () => ({
        ...state,
        votesEndHeight: {
          ...state.votesEndHeight,
          [action.payload.token]: action.payload.endheight
        }
      }),
      [act.REQUEST_SIGNUP_CONFIRMATION]: () => ({
        ...state,
        isShowingSignupConfirmation: true
      }),
      [act.RESET_SIGNUP_CONFIRMATION]: () => ({
        ...state,
        isShowingSignupConfirmation: false
      }),
      [act.CHANGE_ADMIN_FILTER_VALUE]: () => ({
        ...state,
        adminProposalsShow: action.payload
      }),
      [act.CHANGE_PUBLIC_FILTER_VALUE]: () => ({
        ...state,
        publicProposalsShow: action.payload
      }),
      [act.CHANGE_USER_FILTER_VALUE]: () => ({
        ...state,
        userProposalsShow: action.payload
      }),
      [act.CHANGE_DATE_FILTER]: () => ({
        ...state,
        invoiceSortOption: action.payload
      }),
      [act.RESET_DATE_FILTER]: () => ({
        ...state,
        invoiceSortOption: {
          ...state.invoiceSortOption,
          month: FILTER_ALL_MONTHS,
          year: getCurrentYear().year
        }
      }),
      [act.CHANGE_START_PAYOUT_DATE_FILTER]: () => ({
        ...state,
        startPayoutOption: action.payload
      }),
      [act.RESET_START_PAYOUT_DATE_FILTER]: () => ({
        ...state,
        startPayoutOption: {
          ...state.startPayoutOption,
          month: getCurrentMonth() - 1,
          year: getCurrentYear().year
        }
      }),
      [act.CHANGE_END_PAYOUT_DATE_FILTER]: () => ({
        ...state,
        endPayoutOption: action.payload
      }),
      [act.RESET_END_PAYOUT_DATE_FILTER]: () => ({
        ...state,
        endPayoutOption: {
          ...state.endPayoutOption,
          month: getCurrentMonth(),
          year: getCurrentYear().year
        }
      }),
      [act.RESET_PAYWALL_INFO]: () => ({ ...state, userAlreadyPaid: null }),
      [act.UPDATE_USER_PAYWALL_STATUS]: () => ({
        ...state,
        userPaywallStatus: action.payload.status,
        userPaywallTxid: action.payload.txid,
        userAlreadyPaid: action.payload.status === PAYWALL_STATUS_PAID,
        userPaywallConfirmations: action.payload.currentNumberOfConfirmations
      }),
      [act.SET_PROPOSAL_CREDITS]: () => ({
        ...state,
        proposalCredits: action.payload || 0
      }),
      [act.SUBTRACT_PROPOSAL_CREDITS]: () => ({
        ...state,
        proposalCredits: state.proposalCredits - (action.payload || 0)
      }),
      [act.LOAD_ME]: () => {
        const proposalCredits = action.payload.response.proposalcredits;
        return {
          ...state,
          proposalCredits: proposalCredits || state.proposalCredits
        };
      },
      [act.ADD_PROPOSAL_CREDITS]: () => ({
        ...state,
        recentPayments: state.recentPayments
          ? !state.recentPayments.find((el) => el.txid === action.payload.txid)
            ? [
                ...state.recentPayments,
                {
                  txid: action.payload.txid,
                  amount: action.payload.amount
                }
              ]
            : [...state.recentPayments]
          : [
              {
                txid: action.payload.txid,
                amount: action.payload.amount
              }
            ],
        proposalCredits: state.proposalCredits + (action.payload.amount || 0)
      }),
      [act.CSRF_NEEDED]: () => ({ ...state, csrfIsNeeded: action.payload }),
      [act.SHOULD_AUTO_VERIFY_KEY]: () => ({
        ...state,
        shouldVerifyKey: action.payload
      }),
      [act.IDENTITY_IMPORTED]: () => ({
        ...state,
        identityImportResult: action.payload
      }),
      [act.SET_ONBOARD_AS_VIEWED]: () => ({ ...state, onboardViewed: true }),
      [act.SET_COMMENTS_SORT_OPTION]: () => ({
        ...state,
        commentsSortOption: action.payload
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
      [act.SET_DCCS_CURRENT_STATUS_LIST]: () => ({
        ...state,
        dccs: action.payload
      }),
      [act.REDIRECTED_FROM]: () => ({
        ...state,
        redirectedFrom: action.payload
      }),
      [act.RESET_REDIRECTED_FROM]: () => ({ ...state, redirectedFrom: null }),
      [act.RECEIVE_LOGOUT]: () => DEFAULT_STATE
    }[action.type] || (() => state)
  )());

export default app;
