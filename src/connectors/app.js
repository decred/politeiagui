import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";

const appConnector = connect(
  sel.selectorMap({
    isCMS: sel.isCMS
  }),
  dispatch => bindActionCreators({}, dispatch)
);

export default appConnector;
