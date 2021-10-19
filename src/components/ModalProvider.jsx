import React, { useState, createContext, useCallback, useRef } from "react";

export const modalContext = createContext({ component: () => null, props: {} });

const initialState = {
  component: () => null,
  props: {
    show: false
  }
};

const ModalProvider = ({ children }) => {
  const modalStack = useRef([]);
  const modalToDisplay = useRef(initialState);
  // Modals are refs, and refs doesn't trigger component re-render. This
  // will force the state update, hence a modal update.
  const [, setIsDisplaying] = useState(false);

  const handleOpenModal = useCallback(function (
    modal,
    props = {},
    { overlay } = {}
  ) {
    const newModal = { component: modal, props: { show: true, ...props } };
    if (!modalStack.current || overlay) {
      modalStack.current && modalStack.current.push(newModal);
      modalToDisplay.current = newModal;
      setIsDisplaying(true);
    } else if (modalToDisplay.current && !modalToDisplay.current.props.show) {
      modalToDisplay.current = newModal;
      setIsDisplaying(true);
    }
  },
  []);

  const handleCloseModal = useCallback(function () {
    modalStack.current && modalStack.current.pop();
    const previousModal = modalStack.current && modalStack.current.pop();
    modalToDisplay.current = previousModal || initialState;
    setIsDisplaying(false);
  }, []);

  const props = {
    onClose: handleCloseModal,
    ...modalToDisplay.current.props
  };

  return (
    <modalContext.Provider value={[handleOpenModal, handleCloseModal]}>
      {children}
      <modalToDisplay.current.component {...props} />
    </modalContext.Provider>
  );
};

export default ModalProvider;
