import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as act from "../actions";
import * as sel from "../selectors";

const verifyConnector = connect(
  sel.selectorMap({
    verifyNewUser: sel.verifyNewUser,
    isRequestingVerifyNewUser: sel.isApiRequestingVerifyNewUser,
    verifyNewUserError: sel.apiVerifyNewUserError,
    isCMS: sel.isCMS
  }),
  dispatch =>
    bindActionCreators(
      {
        onVerify: act.onVerifyNewUser
      },
      dispatch
    )
);

export default verifyConnector;
