import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import ModalContent from "./ModalContent";
import connector from "../../connectors/modalStack";

class ModalStack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: []
    };
  }
  componentWillReceiveProps({ openedModals }) {
    const { modals } = this.state;
    let modalChanged = false;
    if(modals.length > openedModals.length) {
      modalChanged = true;
      modals.pop();
    } else if(modals.length < openedModals.length){
      modalChanged = true;
      const lastPosition = openedModals.length - 1;
      const lastInsertedModal = openedModals[lastPosition];
      modals.push(
        this.renderModalContent(lastInsertedModal)
      );
    }
    if(modalChanged) this.setState({ modals }, () => {
      if (modals.length !== 0)
        document.querySelector("body").style.overflowY = "hidden";
      else document.querySelector("body").style.overflowY = "scroll";
    });
  }
  renderModalContent = (modalData) => (
    <Modal key={modalData.type}>
      <ModalContent modalData={modalData} />
    </Modal>
  )
  render() {
    return this.state.modals;
  }
}

ModalStack.propTypes = {
  openedModals: PropTypes.array.isRequired
};

export default connector(ModalStack);
