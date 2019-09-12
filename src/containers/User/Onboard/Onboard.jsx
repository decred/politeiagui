import React, { useEffect } from "react";
import ModalOnboard from "src/componentsv2/ModalOnboard";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { useUserOnboard } from "./hooks";

const Onboard = () => {
  const { firstUserAccess } = useUserOnboard();
  const [showModal, openModal, closeModal] = useBooleanState(false);

  useEffect(() => {
    if (firstUserAccess) {
      openModal();
    }
  }, [firstUserAccess, openModal]);

  return <ModalOnboard show={showModal} onClose={closeModal} />;
};

export default Onboard;
