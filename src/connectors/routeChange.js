import { connect } from "react-redux";
import { onRouteChange, onLoadMe } from "../actions/app";

const routeChangeConnector = connect(
  null,
  {
    onRouteChange,
    onLoadMe
  }
);

export default routeChangeConnector;
