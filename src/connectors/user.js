import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";
import {
  MANAGE_USER_CLEAR_USER_PAYWALL,
  MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  MANAGE_USER_UNLOCK,
  MANAGE_USER_DEACTIVATE,
  MANAGE_USER_REACTIVATE
} from "../constants";

const userConnector = connect(
  sel.selectorMap({
    userId: compose(
      get(["match", "params", "userId"]),
      arg(1)
    ),
    loggedInAsUserId: sel.userid,
    user: sel.user,
    error: sel.apiUserError,
    errorRescan: sel.apiRescanUserPaymentsError,
    isLoadingRescan: sel.isApiRequestingRescanUserPayments,
    isLoading: or(sel.isApiRequestingUser, sel.isApiRequestingMe),
    isLoadingProposals: or(
      sel.userProposalsIsRequesting,
      sel.isApiRequestingPropsVoteStatus
    ),
    isTestnet: sel.isTestNet,
    loggedInAsEmail: sel.loggedInAsEmail,
    userProposals: sel.getUserProposals,
    isAdmin: sel.isAdmin,
    lastLoadedUserDetailProposal: sel.lastLoadedUserDetailProposal,
    lastLoadedProposal: sel.lastLoadedUserProposal,
    getSubmittedUserProposals: sel.getSubmittedUserProposals,
    identityImportError: sel.identityImportError,
    identityImportSuccess: sel.identityImportSuccess,
    keyMismatch: sel.getKeyMismatch,
    updateUserKey: sel.updateUserKey,
    updateUserKeyError: sel.updateUserKeyError,
    shouldAutoVerifyKey: sel.shouldAutoVerifyKey,
    verificationToken: sel.verificationToken,
    userPubkey: sel.userPubkey,
    loggedInAsUsername: sel.loggedInAsUsername,
    amountOfCreditsAddedOnRescan: sel.amountOfCreditsAddedOnRescan,
    rescanUserId: sel.apiRescanUserPaymentsUserId,
    isApiRequestingMarkAsPaid: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_CLEAR_USER_PAYWALL,
    isApiRequestingMarkNewUserAsExpired: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
    isApiRequestingMarkUpdateKeyAsExpired: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) ===
        MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
    isApiRequestingMarkResetPasswordAsExpired: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) ===
        MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
    isApiRequestingUnlockUser: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_UNLOCK,
    isApiRequestingDeactivateUser: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_DEACTIVATE,
    isApiRequestingReactivateUser: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_REACTIVATE,
    manageUserResponse: sel.manageUserResponse,
    numOfUserProposals: sel.numOfUserProposals
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchUserProposals: act.onFetchUserProposals,
        onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus,
        onFetchData: act.onFetchUser,
        openModal: act.openModal,
        keyMismatchAction: act.keyMismatch,
        onIdentityImported: act.onIdentityImported,
        confirmWithModal: act.confirmWithModal,
        onUpdateUserKey: act.onUpdateUserKey,
        onManageUser: act.onManageUser,
        onRescan: act.onRescanUserPayments,
        onResetRescan: act.onResetRescanUserPayments
      },
      dispatch
    )
);

export default compose(
  withRouter,
  userConnector
);
