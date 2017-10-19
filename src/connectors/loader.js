import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as act from "../actions";

export default connect(
  (state, ownProps) => ownProps,
  dispatch => bindActionCreators({
    onInit: act.onInit
  }, dispatch)
);
