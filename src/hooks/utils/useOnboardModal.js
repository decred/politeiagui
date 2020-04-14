import { useEffect, useState } from "react";
import ModalOnboard from "src/components/ModalOnboard";
import useModalContext from "src/hooks/utils/useModalContext";
import { useSelector } from "src/redux";
import * as sel from "src/selectors";

export default function useOnboardModal() {
  const loginResponse = useSelector(sel.apiLoginResponse);
  const firstUserAccess = loginResponse && !loginResponse.lastlogintime;
  const [showOnboard, setShowOnboard] = useState(firstUserAccess);

  const [handleOpenModal, handleCloseModal] = useModalContext();

  useEffect(() => {
    setShowOnboard(firstUserAccess);
  }, [firstUserAccess]);

  useEffect(() => {
    if (showOnboard) {
      setShowOnboard(false);
      handleOpenModal(ModalOnboard, {
        onClose: handleCloseModal
      });
    }
  }, [handleCloseModal, handleOpenModal, showOnboard]);
}
