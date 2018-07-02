import { connect } from "react-redux";
import * as act from "../actions";

export default connect(
  null,
  {
    redirectedFrom: act.redirectedFrom
  }
);
