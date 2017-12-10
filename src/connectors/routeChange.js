import { connect } from "react-redux";
import { onRouteChange } from "../actions/api";

const routeChangeConnector = connect(
  null,
  { onRouteChange }
);

export default routeChangeConnector;
