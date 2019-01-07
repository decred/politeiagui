import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    openedModals: sel.getopenedModals
  }),
  dispatch =>
    bindActionCreators(
      {
        closeModal: act.closeModal,
        closeAllModals: act.closeAllModals
      },
      dispatch
    )
);
