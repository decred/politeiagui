import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const newProposalConnector = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    error: sel.newDCCError,
    newDCCResponse: sel.apiNewDCCResponse,
    isLoading: sel.isApiRequestingNewDCC,
    token: sel.newDCCToken,
    dccs: sel.dccsByStatus
  }),
  {
    onSubmitDCC: act.onSaveNewDCC,
    onSaveDraftDCC: act.onSaveDraftDCC,
    onFetchDCCs: act.onFetchDCCs
  }
);

export default newProposalConnector;
