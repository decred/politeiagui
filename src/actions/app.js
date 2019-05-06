import Promise from "promise";
import { reset } from "redux-form";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import {
  onSubmitProposal,
  onChangeUsername,
  onChangePassword,
  onFetchProposalComments,
  onSubmitEditedProposal,
  onSubmitInvoice,
  onSubmitEditedInvoice,
  onFetchInvoiceComments
} from "./api";
import {
  onFetchProposal as onFetchProposalApi,
  onSubmitComment as onSubmitCommentApi,
  onFetchInvoice as onFetchInvoiceApi
} from "./api";
import { resetNewProposalData } from "../lib/editors_content_backup";
import * as sel from "../selectors";
import act from "./methods";
import { TOP_LEVEL_COMMENT_PARENTID } from "../lib/api";
import { onLogout, onEditUser, cleanErrors } from "./api";
import { loadStateLocalStorage, loggedInStateKey } from "../lib/local_storage";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_FILTER_ALL,
  PROPOSAL_APPROVED,
  PROPOSAL_REJECTED
} from "../constants";
import { fromUSDUnitsToUSDCents } from "../helpers";

export const SET_REPLY_PARENT = "SET_REPLY_PARENT";

export const onRouteChange = () => dispatch => {
  dispatch(cleanErrors());
};

export const onSetReplyParent = (
  parentId = TOP_LEVEL_COMMENT_PARENTID
) => dispatch =>
  Promise.all([
    dispatch(act.SET_REPLY_PARENT(parentId)),
    dispatch(reset("form/reply"))
  ]);

export const onSaveNewInvoice = (
  {
    month,
    year,
    name,
    location,
    contact,
    rate,
    address,
    lineitems,
    exchangerate,
    files
  },
  _,
  props
) => (dispatch, getState) => {
  // const lineItems = convertGridToLineItems(datasheet);
  dispatch(
    onSubmitInvoice(
      props.loggedInAsEmail,
      props.userid,
      props.username,
      +month,
      +year,
      exchangerate,
      name,
      location,
      contact,
      fromUSDUnitsToUSDCents(+rate),
      address,
      lineitems,
      files
    )
  ).then(() => sel.newInvoiceToken(getState()));
};

export const onSaveNewProposal = ({ name, description, files }, _, props) => (
  dispatch,
  getState
) =>
  dispatch(
    onSubmitProposal(
      props.loggedInAsEmail,
      props.userid,
      props.username,
      name.trim(),
      description,
      files
    )
  ).then(() => sel.newProposalToken(getState()));

export const onEditProposal = (
  { name, description, files },
  _,
  props
) => dispatch =>
  dispatch(
    onSubmitEditedProposal(
      props.loggedInAsEmail,
      name.trim(),
      description,
      files,
      props.token
    )
  );

export const onEditInvoice = (
  {
    month,
    year,
    name,
    location,
    contact,
    rate,
    address,
    lineitems,
    exchangerate,
    files
  },
  _,
  props
) => dispatch => {
  dispatch(
    onSubmitEditedInvoice(
      props.loggedInAsEmail,
      props.userid,
      props.username,
      +month,
      +year,
      exchangerate,
      name,
      location,
      contact,
      fromUSDUnitsToUSDCents(+rate),
      address,
      lineitems,
      files,
      props.token
    )
  );
};
export const onSaveDraftProposal = ({ name, description, files, draftId }) => {
  resetNewProposalData();
  return act.SAVE_DRAFT_PROPOSAL({
    name: name.trim(),
    description,
    files,
    timestamp: Date.now() / 1000,
    draftId
  });
};

export const onLoadDraftProposals = email => {
  const stateFromLS = loadStateLocalStorage(email);
  const drafts = sel.draftProposals(stateFromLS) || {};
  return act.LOAD_DRAFT_PROPOSALS(drafts);
};

export const onDeleteDraftProposal = draftId =>
  act.DELETE_DRAFT_PROPOSAL(draftId);

export const onSaveChangeUsername = ({ password, newUsername }) => (
  dispatch,
  getState
) =>
  dispatch(onChangeUsername(password, newUsername)).then(() =>
    sel.newProposalToken(getState())
  );

export const onSaveChangePassword = ({ existingPassword, newPassword }) => (
  dispatch,
  getState
) =>
  dispatch(onChangePassword(existingPassword, newPassword)).then(() =>
    sel.newProposalToken(getState())
  );

export const onFetchProposalApp = token => dispatch =>
  dispatch(onFetchProposalApi(token)).then(() =>
    dispatch(onFetchProposalComments(token))
  );

export const onFetchInvoiceApp = (token, version = null) => dispatch =>
  dispatch(onFetchInvoiceApi(token, version)).then(() =>
    dispatch(onFetchInvoiceComments(token))
  );

export const onLoadMe = me => dispatch => {
  dispatch(act.LOAD_ME(me));
};

export const onResetPaywallInfo = () => act.RESET_PAYWALL_INFO();
export const onChangeAdminFilter = option =>
  act.CHANGE_ADMIN_FILTER_VALUE(option);
export const onChangePublicFilter = option =>
  act.CHANGE_PUBLIC_FILTER_VALUE(option);
export const onChangeUserFilter = option =>
  act.CHANGE_USER_FILTER_VALUE(option);

export const onChangeDateFilter = (month, year) =>
  act.CHANGE_DATE_FILTER({ month, year });

export const onResetDateFilter = () => act.RESET_DATE_FILTER();

export const onChangeProposalStatusApproved = status =>
  act.SET_PROPOSAL_APPROVED(status);

export const onIdentityImported = (successMsg, errorMsg = "") =>
  act.IDENTITY_IMPORTED({ errorMsg, successMsg });

export const onSubmitCommentApp = (...args) => dispatch =>
  dispatch(onSubmitCommentApi(...args)).then(() =>
    dispatch(onSetReplyParent())
  );

export const onLocalStorageChange = event => (dispatch, getState) => {
  const state = getState();

  if (event.key !== loggedInStateKey) {
    return;
  }

  const apiMeResponse = sel.apiMeResponse(state);

  try {
    const stateFromStorage = JSON.parse(event.newValue);
    const apiMeFromStorage = get(stateFromStorage, ["api", "me"], undefined);
    const apiMeResponseFromStorage = sel.apiMeResponse(stateFromStorage);

    if (
      apiMeResponseFromStorage &&
      !isEqual(apiMeResponseFromStorage, apiMeResponse)
    ) {
      dispatch(onLoadMe(apiMeFromStorage));
    } else if (!stateFromStorage || (stateFromStorage && !apiMeFromStorage))
      dispatch(act.RECEIVE_LOGOUT({}));
  } catch (e) {
    dispatch(onLogout());
  }
};

export const selectDefaultPublicFilterValue = (dispatch, getState) => {
  const filterValue = selectDefaultFilterValue(
    sel.getVettedProposalFilterCounts(getState()),
    [
      PROPOSAL_VOTING_ACTIVE,
      PROPOSAL_VOTING_NOT_AUTHORIZED,
      PROPOSAL_FILTER_ALL,
      PROPOSAL_APPROVED,
      PROPOSAL_REJECTED
    ]
  );
  dispatch(onChangePublicFilter(filterValue));
};

export const selectDefaultAdminFilterValue = (dispatch, getState) => {
  const filterValue = selectDefaultFilterValue(
    sel.getUnvettedProposalFilterCounts(getState()),
    [PROPOSAL_STATUS_UNREVIEWED, PROPOSAL_FILTER_ALL]
  );
  dispatch(onChangeAdminFilter(filterValue));
};

// Chooses a sensible default filter - don't pick a filter with 0 proposals.
const selectDefaultFilterValue = (
  proposalFilterCounts,
  defaultFilterPreferences
) => {
  for (const filterPreference of defaultFilterPreferences) {
    if ((proposalFilterCounts[filterPreference] || 0) > 0) {
      return filterPreference;
    }
  }

  return defaultFilterPreferences[defaultFilterPreferences.length - 1];
};

export const setOnboardAsViewed = () => act.SET_ONBOARD_AS_VIEWED();

export const resetLastSubmittedProposal = () => act.RESET_LAST_SUBMITTED();

export const onSetCommentsSortOption = option =>
  act.SET_COMMENTS_SORT_OPTION(option);

export const toggleCreditsPaymentPolling = bool =>
  act.TOGGLE_CREDITS_PAYMENT_POLLING(bool);

export const toggleProposalPaymentReceived = bool =>
  act.TOGGLE_PROPOSAL_PAYMENT_RECEIVED(bool);

export const onEditUserPreferences = preferences => dispatch =>
  dispatch(onEditUser(sel.resolveEditUserValues(preferences)));

// CMS
export const onResetInviteUser = () => act.RESET_INVITE_USER();
