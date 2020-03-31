import React, { useState, createContext } from "react";

export const modalContext = createContext();

const initialState = {
  component: () => null,
  props: {
    show: false
  }
};

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(initialState);
  const handleOpenModal = function handleOpenModal(modal, props = {}) {
    setModal({
      component: modal,
      props: {
        show: true,
        ...props
      }
    });
  };

  const handleCloseModal = function handleCloseModal() {
    setModal(initialState);
  };

  const props = {
    onClose: handleCloseModal,
    ...modal.props
  };
  return (
    <modalContext.Provider value={[handleOpenModal, handleCloseModal]}>
      {children}
      <modal.component {...props} />
    </modalContext.Provider>
  );
};

export default ModalProvider;
