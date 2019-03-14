import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import { closeModal, closeAllModals, openModal } from "../actions";
import { confirmWithModal } from "../actions/modal";

export default connect(
  sel.selectorMap({
    isTestnet: sel.isTestNet
  }),
  dispatch =>
    bindActionCreators(
      {
        closeModal: closeModal,
        closeAllModals: closeAllModals,
        openModal: openModal,
        confirmWithModal: confirmWithModal
      },
      dispatch
    )
);
