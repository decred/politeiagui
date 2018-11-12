import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";

const changePasswordConnector = connect(
  sel.selectorMap({
    policy: sel.policy,
    isApiRequestingChangePassword: or(
      sel.isApiRequestingInit,
      sel.isApiRequestingChangePassword
    ),
    changePasswordResponse: sel.apiChangePasswordResponse
  }),
  {
    onChangePassword: act.onSaveChangePassword,
    onFetchData: act.onGetPolicy
  }
);

export default changePasswordConnector;
