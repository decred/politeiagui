import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";

const changePasswordConnector = connect(
  sel.selectorMap({
    isApiRequestingChangePassword: or(sel.isApiRequestingInit, sel.isApiRequestingChangePassword),
    changePasswordResponse: sel.apiChangePasswordResponse,
  }),
  { onChangePassword: act.onSaveChangePassword }
);

export default changePasswordConnector;
