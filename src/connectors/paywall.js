import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    paywallAddress: sel.paywallAddress,
    paywallAmount: sel.paywallAmount,
    VerificationToken: sel.VerificationToken,
  }),
  dispatch => bindActionCreators({
    onLogout: act.onLogout,
  }, dispatch)
);
