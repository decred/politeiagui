import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";

const routeConnector = connect(
  sel.selectorMap({
    isCMS: sel.isCMS
  }),
  dispatch => bindActionCreators({}, dispatch)
);

export default routeConnector;
