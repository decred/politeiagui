import {
  onSubmitProposal,
  onChangeUsername,
  onChangePassword,
  onFetchProposalComments,
  onSubmitEditedProposal,
  onSubmitInvoice,
  onSubmitEditedInvoice,
  onFetchInvoiceComments,
  onUserProposalCredits,
  onSubmitNewDcc
} from "./api";
import {
  onFetchProposal as onFetchProposalApi,
  onSubmitComment as onSubmitCommentApi,
  onFetchInvoice as onFetchInvoiceApi,
  onFetchDccsByStatus as onFetchDccsByStatusApi,
  onSubmitDccComment as onSubmitDccCommentApi
} from "./api";
import {
  resetNewProposalData,
  resetNewInvoiceData
} from "../lib/editors_content_backup";
import * as sel from "../selectors";
import act from "./methods";
import { onEditUser } from "./api";
import { loadStateLocalStorage } from "../lib/local_storage";
import { fromUSDUnitsToUSDCents, uniqueID } from "../helpers";

export const onSaveNewInvoice = ({
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
}) => (dispatch, getState) => {
  const { email, userid: id, username } = sel.currentUser(getState());
  return dispatch(
    onSubmitInvoice(
      email,
      id,
      username,
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

export const onSaveNewProposal = ({ name, description, files }) => (
  dispatch,
  getState
) => {
  const { email, userid, username } = sel.currentUser(getState());
  return dispatch(
    onSubmitProposal(email, userid, username, name.trim(), description, files)
  )
    .then(() => dispatch(onUserProposalCredits()))
    .then(() => sel.newProposalToken(getState()));
};

export const onSaveNewDcc = ({
  type,
  nomineeid,
  statement,
  domain,
  contractortype
}) => (dispatch, getState) => {
  const { email, userid, username } = sel.currentUser(getState());
  return dispatch(
    onSubmitNewDcc(
      email,
      userid,
      username,
      type,
      nomineeid,
      statement,
      domain,
      contractortype
    )
  ).then(() => sel.newDccToken(getState()));
};

export const onEditProposal = ({ token, name, description, files }) => (
  dispatch,
  getState
) => {
  const email = sel.currentUserEmail(getState());
  return dispatch(
    onSubmitEditedProposal(email, name, description, files, token)
  ).then(() => dispatch(onFetchProposalApi(token)).then(() => token));
};

export const onSaveNewComment = ({ comment, token, parentID }) => (
  dispatch,
  getState
) => {
  const email = sel.currentUserEmail(getState());
  return dispatch(onSubmitCommentApi(email, token, comment, parentID));
};

export const onResetUser = () => act.RESET_USER();

export const onEditInvoice = ({
  token,
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
}) => (dispatch, getState) => {
  const { email, userid, username } = sel.currentUser(getState());
  return dispatch(
    onSubmitEditedInvoice(
      email,
      userid,
      username,
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
      token
    )
  );
};

export const onSaveDraftProposal = ({ name, description, files, draftId }) => (
  dispatch
) => {
  resetNewProposalData();
  const id = draftId || uniqueID("draft");
  dispatch(
    act.SAVE_DRAFT_PROPOSAL({
      name: name ? name.trim() : "",
      description,
      files,
      timestamp: Math.floor(Date.now() / 1000),
      id
    })
  );
  return id;
};

export const onLoadDraftProposals = (email) => (dispatch, getState) => {
  const key = email || sel.currentUserEmail(getState());
  const stateFromLS = loadStateLocalStorage(key);
  const drafts = sel.draftProposals(stateFromLS) || {};
  dispatch(act.LOAD_DRAFT_PROPOSALS(drafts));
};

export const onDeleteDraftProposal = (draftId) =>
  act.DELETE_DRAFT_PROPOSAL(draftId);

export const onSaveDraftInvoice = ({
  date,
  name,
  location,
  contact,
  rate,
  address,
  lineitems,
  files,
  draftId
}) => (dispatch, getState) => {
  const policy = sel.policy(getState());
  resetNewInvoiceData(policy);
  const id = draftId || uniqueID("draft");
  dispatch(
    act.SAVE_DRAFT_INVOICE({
      date,
      name,
      location,
      contact,
      rate,
      address,
      lineitems,
      files,
      id,
      timestamp: Date.now() / 1000
    })
  );
  return id;
};

export const onLoadDraftInvoices = (email) => (dispatch, getState) => {
  const key = email || sel.currentUserEmail(getState());
  const stateFromLS = loadStateLocalStorage(key);
  const drafts = sel.draftInvoices(stateFromLS) || {};
  dispatch(act.LOAD_DRAFT_INVOICES(drafts));
};

export const onDeleteDraftInvoice = (draftId) => {
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

export const onFetchProposalApp = (token) => (dispatch) =>
  dispatch(onFetchProposalApi(token)).then(() =>
    dispatch(onFetchProposalComments(token))
  );

export const onFetchInvoiceApp = (token, version = null) => (dispatch) =>
  dispatch(onFetchInvoiceApi(token, version)).then(() =>
    dispatch(onFetchInvoiceComments(token))
  );

export const onResetPaywallInfo = () => act.RESET_PAYWALL_INFO();

export const onIdentityImported = (successMsg, errorMsg = "") =>
  act.IDENTITY_IMPORTED({ errorMsg, successMsg });

export const keyMismatch = (payload) => (dispatch) =>
  dispatch(act.KEY_MISMATCH(payload));

export const toggleCreditsPaymentPolling = (bool) =>
  act.TOGGLE_CREDITS_PAYMENT_POLLING(bool);

export const toggleProposalPaymentReceived = (bool) =>
  act.TOGGLE_PROPOSAL_PAYMENT_RECEIVED(bool);

export const onEditUserPreferences = (preferences) => (dispatch) =>
  dispatch(onEditUser(sel.resolveEditUserValues(preferences)));

export const onResetComments = () => act.RESET_COMMENTS();

export const onLoadDccsByStatus = (status) => (dispatch, getState) => {
  const fetchedDCCs = sel.dccsByStatus(getState());
  if (fetchedDCCs && fetchedDCCs[status]) {
    dispatch(act.SET_DCCS_CURRENT_STATUS_LIST(fetchedDCCs[status]));
  } else {
    dispatch(onFetchDccsByStatusApi(status));
  }
};

export const onSaveNewDccCommentV2 = ({ comment, token, parentID }) => (
  dispatch,
  getState
) => {
  const email = sel.currentUserEmail(getState());
  return dispatch(onSubmitDccCommentApi(email, token, comment, parentID));
};
