import React, { useState, useEffect, useCallback } from "react";
import useBooleanState from "src/hooks/utils/useBooleanState";

const ModalProvider = ({ children, modal, context }) => {
  const [modalProps, setModalProps] = useState({});
  const [id, setId] = useState(undefined);
  const [showModal, openModal, closeModal] = useBooleanState(false);

  // const open

  const handleOpen = useCallback((id, props = {}) => {
    setId(id);
    setModalProps(props);
    openModal();
  }, [openModal]);

  useEffect(
    function resetModalProps() {
      if (!showModal) {
        setModalProps({});
      }
    },
    [showModal]
  );

  return (
    <context.Provider value={[id, showModal, handleOpen, closeModal]}>
      {children}
      {React.cloneElement(modal, {
        show: showModal,
        onClose: closeModal,
        ...modalProps
      })}
    </context.Provider>
  );
};

export default ModalProvider;
