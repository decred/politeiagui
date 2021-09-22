import React, { useState, createContext } from "react";
import isEmpty from "lodash/fp/isEmpty";

export const modalContext = createContext({ component: () => null, props: {} });

const initialState = {
  component: () => null,
  props: {
    show: false
  }
};

const ModalProvider = ({ children }) => {
  const [modalStack] = useState([]);
  const [currentModal, setModal] = useState(initialState);
  const handleOpenModal = function handleOpenModal(
    modal,
    props = {},
    { overlay } = {}
  ) {
    const newModal = { component: modal, props: { show: true, ...props } };
    if (isEmpty(modalStack) || overlay) {
      modalStack.push(newModal);
      setModal(newModal);
    } else if (!currentModal || !currentModal.props.show) {
      setModal(newModal);
    }
  };

  const handleCloseModal = function handleCloseModal() {
    modalStack.pop();
    const previousModal = modalStack.pop();
    setModal(previousModal || initialState);
  };

  const props = {
    onClose: handleCloseModal,
    ...currentModal.props
  };
  return (
    <modalContext.Provider value={[handleOpenModal, handleCloseModal]}>
      {children}
      <currentModal.component {...props} />
    </modalContext.Provider>
  );
};

export default ModalProvider;
