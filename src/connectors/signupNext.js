import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import compose from "lodash/fp/compose";
import { withRouter } from "react-router-dom";
import * as sel from "../selectors";
import * as act from "../actions";

const signupNextConnector = connect(
  sel.selectorMap({
    email: sel.newUserEmail,
    isTestnet: sel.isTestNet,
    verificationToken: sel.verificationToken,
    isRequestingVerifyNewUser: sel.isApiRequestingVerifyNewUser,
    isCMS: sel.isCMS
  }),
  dispatch =>
    bindActionCreators(
      {
        onResetNewUser: act.onResetNewUser
      },
      dispatch
    )
);

export default compose(
  withRouter,
  signupNextConnector
);
