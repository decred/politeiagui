import { connect } from "react-redux";
import { onRouteChange, onLoadMe } from "../actions/app";
import * as sel from "../selectors";

const routeChangeConnector = connect(
  sel.selectorMap({
    isCMS: sel.isCMS
  }),
  {
    onRouteChange,
    onLoadMe
  }
);

export default routeChangeConnector;
