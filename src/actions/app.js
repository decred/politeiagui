import {
  onSubmitProposal,
  onChangeUsername,
  onChangePassword,
  onSubmitEditedProposal,
  onSubmitInvoice,
  onSubmitEditedInvoice,
  onUserProposalCredits,
  onSubmitNewDcc
} from "./api";
import {
  onSubmitComment as onSubmitCommentApi,
  onSubmitDccComment as onSubmitDccCommentApi
} from "./api";
import {
  resetNewProposalData,
  resetNewInvoiceData,
  resetNewDccData
} from "../lib/editors_content_backup";
import * as sel from "../selectors";
import act from "./methods";
import { onEditUser } from "./api";
import { loadStateLocalStorage } from "../lib/local_storage";
import { fromUSDUnitsToUSDCents, uniqueID } from "../helpers";

export const onSaveNewInvoice =
  ({
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
  }) =>
  (dispatch, getState) => {
    const { userid: id, username } = sel.currentUser(getState());
    return dispatch(
      onSubmitInvoice(
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

export const onSaveNewProposal =
  ({
    name,
    amount,
    sDate,
    eDate,
    domain,
    description,
    files,
    rfpDeadline,
    rfpLink,
    type
  }) =>
  (dispatch, getState) => {
    const { userid, username } = sel.currentUser(getState());
    return dispatch(
      onSubmitProposal(
        userid,
        username,
        name.trim(),
        amount * 100, // Backend expects value in cents
        sDate,
        eDate,
        domain,
        description,
        rfpDeadline,
        type,
        rfpLink,
        files
      )
    )
      .then(() => dispatch(onUserProposalCredits()))
      .then(() => sel.newProposalToken(getState()));
  };

export const onSaveNewDcc =
  ({ type, nomineeid, statement, domain, contractortype }) =>
  (dispatch, getState) => {
    const { userid, username } = sel.currentUser(getState());
    return dispatch(
      onSubmitNewDcc(
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

export const onEditProposal =
  ({ token, name, description, files, rfpDeadline, type, rfpLink }) =>
  (dispatch, getState) => {
    const userid = sel.currentUserID(getState());
    return dispatch(
      onSubmitEditedProposal(
        userid,
        name,
        description,
        rfpDeadline,
        type,
        rfpLink,
        files,
        token
      )
    );
  };

export const onSaveNewComment =
  ({ comment, token, parentID, state }) =>
  (dispatch, getState) => {
    const userid = sel.currentUserID(getState());
    return dispatch(
      onSubmitCommentApi(userid, token, comment, parentID, state)
    );
  };

export const onEditInvoice =
  ({
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
  }) =>
  (dispatch, getState) => {
    const { userid, username } = sel.currentUser(getState());
    return dispatch(
      onSubmitEditedInvoice(
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

export const onSaveDraftProposal =
  ({ name, description, rfpDeadline, type, rfpLink, files, draftId }) =>
  (dispatch) => {
    resetNewProposalData();
    const id = draftId || uniqueID("draft");
    dispatch(
      act.SAVE_DRAFT_PROPOSAL({
        name: name ? name.trim() : "",
        description,
        files,
        rfpDeadline,
        type,
        rfpLink,
        timestamp: Math.floor(Date.now() / 1000),
        id
      })
    );
    return id;
  };

export const onLoadDraftProposals = (uuid) => (dispatch, getState) => {
  const key = uuid || sel.currentUserID(getState());
  const stateFromLS = loadStateLocalStorage(key);
  const drafts = sel.draftProposals(stateFromLS) || null;
  dispatch(act.LOAD_DRAFT_PROPOSALS(drafts));
};

export const onDeleteDraftProposal = (draftId) =>
  act.DELETE_DRAFT_PROPOSAL(draftId);

export const onSaveDraftInvoice =
  ({ draftId, ...rest }) =>
  (dispatch, getState) => {
    const policy = sel.policy(getState());
    resetNewInvoiceData(policy);
    const id = draftId || uniqueID("draft");
    dispatch(
      act.SAVE_DRAFT_INVOICE({
        id,
        timestamp: Date.now() / 1000,
        ...rest
      })
    );
    return id;
  };

export const onLoadDraftInvoices = (uuid) => (dispatch, getState) => {
  const key = uuid || sel.currentUserID(getState());
  const stateFromLS = loadStateLocalStorage(key);
  const drafts = sel.draftInvoices(stateFromLS) || null;
  dispatch(act.LOAD_DRAFT_INVOICES(drafts));
};

export const onDeleteDraftInvoice = (draftId) => {
  return act.DELETE_DRAFT_INVOICE(draftId);
};

export const onSaveChangeUsername =
  ({ password, newUsername }) =>
  (dispatch) =>
    dispatch(onChangeUsername(password, newUsername));

export const onSaveChangePassword =
  ({ existingPassword, newPassword }) =>
  (dispatch) =>
    dispatch(onChangePassword(existingPassword, newPassword));

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

export const onSaveNewDccComment =
  ({ comment, token, parentID }) =>
  (dispatch, getState) => {
    const userid = sel.currentUserID(getState());
    return dispatch(onSubmitDccCommentApi(userid, token, comment, parentID));
  };

export const onSaveDraftDcc =
  ({
    type,
    nomineeid,
    statement,
    domain,
    contractortype,
    id: draftId,
    nomineeusername
  }) =>
  (dispatch) => {
    resetNewDccData();
    const id = draftId || uniqueID("draft");
    dispatch(
      act.SAVE_DRAFT_DCC({
        type,
        nomineeid,
        statement,
        domain,
        contractortype,
        id,
        nomineeusername,
        timestamp: Date.now() / 1000
      })
    );
    return id;
  };

export const onLoadDraftDccs = (uuid) => (dispatch, getState) => {
  const key = uuid || sel.currentUserID(getState());
  const stateFromLS = loadStateLocalStorage(key);
  const drafts = sel.draftDccs(stateFromLS) || null;
  dispatch(act.LOAD_DRAFT_DCCS(drafts));
};

export const onDeleteDraftDcc = (draftId) => {
  return act.DELETE_DRAFT_DCC(draftId);
};
