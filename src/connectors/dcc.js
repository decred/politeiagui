import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg } from "../lib/fp";

const dccConnector = connect(
  sel.selectorMap({
    token: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "token"]),
      arg(1)
    ),
    loggedInAsEmail: sel.loggedInAsEmail,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    error: sel.newDCCError,
    newDCCResponse: sel.apiNewDCCResponse,
    isLoading: sel.isApiRequestingNewDCC,
    newToken: sel.newDCCToken,
    dccs: sel.dccsByStatus,
    dcc: sel.dccDetails,
    nomineeUsername: sel.getUserUsername
  }),
  {
    onSubmitDCC: act.onSaveNewDCC,
    onSaveDraftDCC: act.onSaveDraftDCC,
    onFetchDCCsByStatus: act.onFetchDCCsByStatus,
    onLoadDCC: act.onLoadDCC,
    onFetchUser: act.onFetchUser,
    onSupportOpposeDCC: act.onSupportOpposeDCC
  }
);

export default dccConnector;
