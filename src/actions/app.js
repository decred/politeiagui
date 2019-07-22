import Promise from "promise";
import { reset } from "redux-form";
import {
  onSubmitProposal,
  onChangeUsername,
  onChangePassword,
  onFetchProposalComments,
  onSubmitEditedProposal,
  onSubmitInvoice,
  onSubmitEditedInvoice,
  onFetchInvoiceComments,
  handleLogout,
  onRequestMe
} from "./api";
import {
  onFetchProposal as onFetchProposalApi,
  onSubmitComment as onSubmitCommentApi,
  onFetchInvoice as onFetchInvoiceApi
} from "./api";
import {
  resetNewProposalData,
  resetNewInvoiceData
} from "../lib/editors_content_backup";
import * as sel from "../selectors";
import act from "./methods";
import { TOP_LEVEL_COMMENT_PARENTID, apiInfo } from "../lib/api";
import { onEditUser, cleanErrors } from "./api";
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
import { openModal } from "./modal";
import * as modalTypes from "../components/Modal/modalTypes";

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

export const onSaveNewProposalV2 = ({ name, description, files }) => (
  dispatch,
  getState
) => {
  const email = sel.loggedInAsEmail(getState());
  const id = sel.userid(getState());
  const username = sel.loggedInAsUsername(getState());

  return dispatch(
    onSubmitProposal(email, id, username, name.trim(), description, files)
  ).then(() => sel.newProposalToken(getState()));
};

export const onEditProposalV2 = ({ token, name, description, files }) => (
  dispatch,
  getState
) => {
  const email = sel.loggedInAsEmail(getState());

  return dispatch(
    onSubmitEditedProposal(email, name, description, files, token)
  );
};

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

export const onSaveDraftInvoice = ({
  month,
  year,
  name,
  location,
  contact,
  rate,
  address,
  lineitems,
  files,
  draftId
}) => {
  resetNewInvoiceData();
  return act.SAVE_DRAFT_INVOICE({
    month,
    year,
    name,
    location,
    contact,
    rate,
    address,
    lineitems,
    files,
    draftId,
    timestamp: Date.now() / 1000
  });
};

export const onLoadDraftInvoices = email => {
  const stateFromLS = loadStateLocalStorage(email);
  const drafts = sel.draftInvoices(stateFromLS) || {};
  return act.LOAD_DRAFT_INVOICES(drafts);
};

export const onDeleteDraftInvoice = draftId => {
  return act.DELETE_DRAFT_INVOICE(draftId);
};

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

export const onLocalStorageChange = event => async (dispatch, getState) => {
  const state = getState();

  if (event.key !== loggedInStateKey) {
    return;
  }

  const apiMeResponse = sel.apiMeResponse(state);

  const localUserDataDeleted = !event.newValue;

  // user local data was cleared but the user data in the app
  // state is also empty so there is nothing to do here
  if (localUserDataDeleted && !apiMeResponse) {
    return;
  }

  // request the api info to see if there is an active user
  const apiInfoResponse = await apiInfo();
  const userActive = apiInfoResponse.activeusersession;

  // user is not active so we just trigger the logout action
  // to clear the app state
  if (!userActive) {
    dispatch(handleLogout());
    dispatch(
      openModal(
        modalTypes.LOGIN,
        {
          title: "Your session has expired. Please log in again.",
          redirectAfterLogin: window.location.pathname
        },
        null
      )
    );
    return;
  }

  // From this point we know the user is active and the local storage
  // has changed. Because of it we can no longer trust the data saved in there.
  // Hence, we update the user data by querying it from the api.
  dispatch(onRequestMe());
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
