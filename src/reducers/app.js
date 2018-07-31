import * as act from "../actions/types";
import { TOP_LEVEL_COMMENT_PARENTID } from "../lib/api";
import { getDraftsProposalsFromLocalStorage, deleteDraftProposalFromLocalStorage } from "../lib/local_storage";
import { PROPOSAL_STATUS_UNREVIEWED, PROPOSAL_VOTING_ACTIVE, PAYWALL_STATUS_PAID, PROPOSAL_USER_FILTER_SUBMITTED } from "../constants";

export const DEFAULT_STATE = {
  isShowingSignupConfirmation: false,
  replyParent: TOP_LEVEL_COMMENT_PARENTID,
  newProposal: {
    name: "",
    description: ""
  },
  adminProposalsShow: PROPOSAL_STATUS_UNREVIEWED,
  publicProposalsShow: PROPOSAL_VOTING_ACTIVE,
  userProposalsShow: PROPOSAL_USER_FILTER_SUBMITTED,
  proposalCredits: 0,
  submittedProposals: {},
  draftProposals: getDraftsProposalsFromLocalStorage(),
  identityImportResult: { errorMsg: "", successMsg: "" }
};

const app = (state = DEFAULT_STATE, action) => (({
  [act.SET_REPLY_PARENT]: () => ({ ...state, replyParent: action.payload || TOP_LEVEL_COMMENT_PARENTID}),
  [act.RECEIVE_NEW_PROPOSAL]: () => action.error ? state : ({ ...state,
    submittedProposals: {
      ...state.submittedProposals,
      lastSubmitted: action.payload.censorshiprecord.token,
      [action.payload.censorshiprecord.token]: action.payload
    }
  }),
  [act.SET_DRAFT_PROPOSAL]: () => (
    { ...state,
      draftProposals: {
        ...state.draftProposals,
        originalName: action.payload.name
      }
    }
  ),
  [act.SAVE_DRAFT_PROPOSAL]: () => {
    const newDraftProposals = state.draftProposals;
    const originalName = newDraftProposals.originalName;
    if (originalName !== action.payload.name) {
      deleteDraftProposalFromLocalStorage(originalName);
      delete newDraftProposals[originalName];
    }
    return { ...state,
      draftProposals: {
        ...newDraftProposals,
        newDraft: true,
        lastSubmitted: action.payload.name,
        [action.payload.name]: action.payload
      }
    };
  },
  [act.RESET_DRAFT_PROPOSAL]: () => (
    { ...state,
      draftProposals: {
        ...state.draftProposals,
        originalName: false,
        newDraft: false
      }
    }
  ),
  [act.DELETE_DRAFT_PROPOSAL]: () => {
    if (!state.draftProposals[action.payload.name]) {
      return state;
    }
    const newDraftProposals = state.draftProposals;
    delete newDraftProposals[action.payload.name];
    deleteDraftProposalFromLocalStorage(action.payload.name);
    return { ...state,
      draftProposals: newDraftProposals
    };
  },
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
  [act.SET_PROPOSAL_APPROVED]: () => ({...state, isProposalStatusApproved: action.payload}),
  [act.RECEIVE_USERNAMES]: () => ({...state, usernamesById: action.payload.usernamesById }),
  [act.SET_VOTES_END_HEIGHT]: () => ({...state, votesEndHeight: { ...state.votesEndHeight, [action.payload.token]: action.payload.endheight }}),
  [act.REQUEST_SIGNUP_CONFIRMATION]: () => ({ ...state, isShowingSignupConfirmation: true }),
  [act.RESET_SIGNUP_CONFIRMATION]: () => ({ ...state, isShowingSignupConfirmation: false }),
  [act.CHANGE_ADMIN_FILTER_VALUE]: () => ({ ...state, adminProposalsShow: action.payload }),
  [act.CHANGE_PUBLIC_FILTER_VALUE]: () => ({ ...state, publicProposalsShow: action.payload }),
  [act.CHANGE_USER_FILTER_VALUE]: () => ({ ...state, userProposalsShow: action.payload }),
  [act.UPDATE_USER_PAYWALL_STATUS]: () => ({
    ...state,
    userPaywallStatus: action.payload.status,
    userAlreadyPaid: action.payload.status === PAYWALL_STATUS_PAID,
    userPaywallConfirmations: action.payload.currentNumberOfConfirmations
  }),
  [act.SET_PROPOSAL_CREDITS]: () => ({
    ...state,
    proposalCredits: (action.payload || 0)
  }),
  [act.SUBTRACT_PROPOSAL_CREDITS]: () => ({
    ...state,
    proposalCredits: state.proposalCredits - (action.payload || 0)
  }),
  [act.CSRF_NEEDED]: () => ({ ...state, csrfIsNeeded: action.payload }),
  [act.CLEAN_SLATE]: () => ({
    ...state,
    isShowingSignupConfirmation: false
  }),
  [act.SHOULD_AUTO_VERIFY_KEY]: () => ({ ...state, shouldVerifyKey: action.payload }),
  [act.IDENTITY_IMPORTED]: () => ({ ...state, identityImportResult: action.payload })
})[action.type] || (() => state))();

export default app;
