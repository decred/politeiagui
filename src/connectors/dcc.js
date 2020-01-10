import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg } from "../lib/fp";

const dccConnector = connect(
  sel.selectorMap({
    token: compose(
      (t) => (t ? t.toLowerCase() : t),
      get(["match", "params", "token"]),
      arg(1)
    ),
    loggedInAsEmail: sel.loggedInAsEmail,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    newDCCError: sel.newDCCError,
    newDCCResponse: sel.apiNewDCCResponse,
    supportOpposeError: sel.apiSupportOpposeDCCError,
    isLoading: sel.isApiRequestingNewDCC,
    newToken: sel.newDCCToken,
    dccs: sel.dccsByStatus,
    dcc: sel.dccDetails,
    drafts: sel.draftDCCs,
    nomineeUsername: sel.getUserUsername,
    isAdmin: sel.isAdmin,
    statusChangeError: sel.apiSetDCCStatusError
  }),
  {
    onSubmitDCC: act.onSaveNewDCC,
    onSaveDraftDCC: act.onSaveDraftDCC,
    onLoadDraftDCCs: act.onLoadDraftDCCs,
    onFetchDCCsByStatus: act.onLoadDCCsByStatus,
    onForceFetchDCCs: act.onFetchDCCsByStatus,
    onLoadDCC: act.onLoadDCC,
    onFetchUser: act.onFetchUser,
    onSupportOpposeDCC: act.onSupportOpposeDCC,
    onSetDCCStatus: act.onSetDCCStatus,
    confirmWithModal: act.confirmWithModal,
    onDeleteDraftDCC: act.onDeleteDraftDCC
  }
);

export default dccConnector;
