import { connect } from "react-redux";
import { onRouteChange } from "../actions/api";
import { onLoadMe } from "../actions/app";

const routeChangeConnector = connect(
  null,
  {
    onRouteChange,
    onLoadMe
  }
);

export default routeChangeConnector;
