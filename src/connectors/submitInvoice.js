import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const submitInvoiceConnector = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    userCanExecuteActions: sel.userCanExecuteActions,
    policy: sel.policy,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    keyMismatch: sel.getKeyMismatch,
    token: sel.newInvoiceToken
  }),
  {
    onFetchData: act.onGetPolicy,
    onSave: act.onSaveNewInvoice
    //onResetInvoice: act.onResetInvoice,
  }
);

export default submitInvoiceConnector;
