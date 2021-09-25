import PropTypes from "prop-types";
import { useEffect, useCallback } from "react";
import { useSessionChecker } from "./hooks";
import ModalLogin from "src/components/ModalLogin";
import useModalContext from "src/hooks/utils/useModalContext";

const LOGIN_MODAL_ID = "sessionExpiredModal";

const SessionChecker = ({ children, showModal }) => {
  const { sessionExpired, setSessionExpired, handleLogout } =
    useSessionChecker();
  const [handleOpenModal, handleCloseModal] = useModalContext();

  const closeModal = useCallback(() => {
    handleLogout();
    handleCloseModal();
    setSessionExpired(false);
  }, [handleCloseModal, handleLogout, setSessionExpired]);

  const openModal = useCallback(() => {
    handleOpenModal(ModalLogin, {
      onLoggedIn: () => {
        setSessionExpired(false);
        handleCloseModal();
      },
      id: LOGIN_MODAL_ID,
      title: "Your session has expired. Please log in again",
      onClose: closeModal,
      disableDismiss: true
    });
  }, [setSessionExpired, handleOpenModal, closeModal, handleCloseModal]);

  useEffect(() => {
    if (sessionExpired && showModal) {
      openModal();
    }
  }, [sessionExpired, openModal, showModal]);

  return children;
};

SessionChecker.propTypes = {
  children: PropTypes.node.isRequired,
  showModal: PropTypes.bool
};

export default SessionChecker;
