import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { confirmWithModal } from "../actions/modal";

export default connect(
  sel.selectorMap({
  }),
  dispatch => bindActionCreators({
    closeModal: act.closeModal,
    closeAllModals: act.closeAllModals,
    openModal: act.openModal,
    confirmWithModal: confirmWithModal
  }, dispatch)
);
