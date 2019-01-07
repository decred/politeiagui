import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import ModalContent from "./ModalContent";
import modalStackConnector from "../../connectors/modalStack";
import { withRouter } from "react-router-dom";

class ModalStack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: []
    };
  }
  componentWillMount() {
    document.addEventListener("click", this.modalClickHandler);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.modalClickHandler);
  }
  componentDidUpdate(prevProps) {
    const { openedModals, location, closeAllModals } = this.props;
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

    // closes modals if user path has changed
    if (location.pathname !== prevProps.location.pathname) {
      closeAllModals();
    }
  }
  //function which closes all modals if user clicks outside of modal window
  modalClickHandler = event => {
    if (event.target.closest(".modal-content")) return;
    this.props.closeAllModals();
  };
  renderModalContent = modalData => (
    <Modal key={modalData.type}>
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
