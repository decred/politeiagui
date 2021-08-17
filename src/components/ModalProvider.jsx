import React, { useState, createContext } from "react";

export const modalContext = createContext({ component: () => null, props: {} });

const initialState = {
  component: () => null,
  props: {
    show: false
  }
};

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(initialState);
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = function handleOpenModal(modal, props = {}) {
    if (!isModalOpen) {
      setModal({
        component: modal,
        props: {
          show: true,
          ...props
        }
      });
      setModalOpen(true);
    }
  };

  const handleCloseModal = function handleCloseModal() {
    setModal(initialState);
    setModalOpen(false);
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
