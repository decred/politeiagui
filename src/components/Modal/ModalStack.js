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
  componentWillReceiveProps({ opennedModals }) {
    const { modals } = this.state;
    let modalChanged = false;
    if(modals.length > opennedModals.length) {
      modalChanged = true;
      modals.pop();
    } else if(modals.length < opennedModals.length){
      modalChanged = true;
      const lastPosition = opennedModals.length - 1;
      const lastInsertedModal = opennedModals[lastPosition];
      modals.push(
        this.renderModalContent(lastInsertedModal)
      );
    }
    if(modalChanged) this.setState({ modals }, () => {
      if (modals.length !== 0)
        document.querySelector("html").style.overflow = "hidden";
      else document.querySelector("html").style.overflow = "scroll";
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
  opennedModals: PropTypes.array.isRequired
};

export default connector(ModalStack);
