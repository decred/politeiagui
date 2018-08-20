import { connect } from "react-redux";
import * as sel from "../selectors";

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    userHasPaid: sel.userHasPaid,
    paywallAddress: sel.paywallAddress,
    paywallAmount: sel.paywallAmount,
    paywallTxNotBefore: sel.paywallTxNotBefore
  })
);
