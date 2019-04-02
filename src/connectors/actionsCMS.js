import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const actionsCMS = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    email: sel.email,
    userid: sel.userid,
    isAdmin: sel.isAdmin,
    userCanExecuteActions: sel.userCanExecuteActions,
    // setStatusProposalToken: sel.setStatusProposalToken,
    // setStatusProposalError: sel.setStatusProposalError,
    isApiRequestingSetInvoiceStatusByToken:
      sel.isApiRequestingSetInvoiceStatusByToken
    // startVoteError: sel.apiStartVoteError
  }),
  {
    onChangeStatus: act.onSetInvoiceStatus,
    openModal: act.openModal
  }
);

export default actionsCMS;
