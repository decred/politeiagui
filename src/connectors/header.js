import { connect } from "react-redux";
import * as sel from "../selectors";
import { bindActionCreators } from "redux";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
    hasPaid: sel.hasPaid,
  }),
  dispatch => bindActionCreators({
    getPaymentsByAddress: act.getPaymentsByAddress,
  }, dispatch)
);
