import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    isLoading: sel.isApiRequestingLogout,
    error: sel.apiLogoutError
  }),
  dispatch =>
    bindActionCreators(
      {
        onLogout: act.onLogout
      },
      dispatch
    )
);
