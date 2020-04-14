import PropTypes from "prop-types";
import { useEffect, useCallback } from "react";
import { useSessionChecker } from "./hooks";
import useNavigation from "src/hooks/api/useNavigation";
import ModalLogin from "src/components/ModalLogin";
import useModalContext from "src/hooks/utils/useModalContext";

const LOGIN_MODAL_ID = "sessionExpiredModal";

const SessionChecker = ({ children }) => {
  const { sessionExpired, setSessionExpired } = useSessionChecker();
  const { handleLogout } = useNavigation();
  const [handleOpenModal, handleCloseModal] = useModalContext();

  const markSessionExpiredAsFalse = useCallback(() => {
    setSessionExpired(false);
  }, [setSessionExpired]);

  const closeModal = useCallback(() => {
    handleLogout();
    handleCloseModal();
    markSessionExpiredAsFalse();
  }, [handleCloseModal, handleLogout, markSessionExpiredAsFalse]);

  useEffect(() => {
    if (sessionExpired) {
      handleOpenModal(ModalLogin, {
        onLoggedIn: markSessionExpiredAsFalse,
        id: LOGIN_MODAL_ID,
        title: "Your session has expired. Please log in again",
        onClose: closeModal
      });
    }
  }, [sessionExpired, markSessionExpiredAsFalse, handleOpenModal, closeModal]);
  return children;
};

SessionChecker.propTypes = {
  children: PropTypes.node.isRequired
};

export default SessionChecker;
