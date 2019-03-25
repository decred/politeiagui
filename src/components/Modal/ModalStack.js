import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import ModalContent from "./ModalContent";
import modalStackConnector from "../../connectors/modalStack";
import { withRouter } from "react-router-dom";
import { WELCOME_MODAL } from "./modalTypes";

class ModalStack extends React.Component {
  state = {
    modals: []
  };

  componentDidUpdate(prevProps) {
    const { openedModals, location, closeAllModals } = this.props;
    const welcomeModalOpened = openedModals.find(
      modal => modal.type === WELCOME_MODAL
    );
    const { modals } = this.state;
    let modalChanged = false;
    if (modals.length > openedModals.length) {
      modalChanged = true;
      modals.pop();
    } else if (modals.length < openedModals.length) {
      modalChanged = true;
      const lastPosition = openedModals.length - 1;
      const lastInsertedModal = openedModals[lastPosition];
      modals.push(this.renderModalContent(lastInsertedModal));
    }
    if (modalChanged)
      this.setState({ modals }, () => {
        if (modals.length !== 0)
          document.querySelector("body").style.overflowY = "hidden";
        else document.querySelector("body").style.overflowY = "scroll";
      });
    // closes modals if user path has changed except when it's the user's first access
    if (
      location.pathname !== prevProps.location.pathname &&
      !welcomeModalOpened
    ) {
      closeAllModals();
    }
  }

  renderModalContent = modalData => (
    <Modal
      key={modalData.type}
      onClose={this.props.closeAllModals}
      disableCloseOnClick={modalData.options.disableCloseOnClick}
      disableCloseOnEsc={modalData.options.disableCloseOnEsc}
    >
      <ModalContent modalData={modalData} />
    </Modal>
  );
  render() {
    return this.state.modals;
  }
}

ModalStack.propTypes = {
  openedModals: PropTypes.array.isRequired
};

export default withRouter(modalStackConnector(ModalStack));
