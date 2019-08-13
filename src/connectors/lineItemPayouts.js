import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    lineItemPayouts: sel.lineItemPayouts,
    error: sel.generatePayoutsError,
    loading: sel.isApiRequestingLineItemPayouts,
    loggedInAsEmail: sel.loggedInAsEmail
  }),
  {
    onLineItemPayouts: act.onLineItemPayouts
  }
);
