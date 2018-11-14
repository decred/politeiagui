import { connect } from "react-redux";
import compose from "lodash/fp/compose";
import { withRouter } from "react-router-dom";
import * as sel from "../selectors";

const connector = connect(
  sel.selectorMap({
    apiError: sel.apiError
  })
);

export default compose(
  withRouter,
  connector
);
