import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";

const privacyConnector = connect(
  sel.selectorMap({
    isCMS: sel.isCMS,
    isTestnet: sel.isTestNet
  }),
  dispatch => bindActionCreators({}, dispatch)
);

export default privacyConnector;
