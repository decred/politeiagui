import PropTypes from "prop-types";
import { useEffect, useCallback } from "react";
import { useSessionChecker } from "./hooks";
import useNavigation from "src/hooks/api/useNavigation";
import { useLoginModal } from "src/containers/User/Login";

const LOGIN_MODAL_ID = "sessionExpiredModal";

const SessionChecker = ({ children }) => {
  const { sessionExpired, setSessionExpired } = useSessionChecker();
  const { handleLogout } = useNavigation();
  const [id, modalIsOpen, openLoginModal, closeLoginModal] = useLoginModal();

  const markSessionExpiredAsFalse = useCallback(() => {
    setSessionExpired(false);
  }, [setSessionExpired]);
  const logout = useCallback(() => {
    handleLogout();
    markSessionExpiredAsFalse();
  }, [handleLogout, markSessionExpiredAsFalse]);

  useEffect(() => {
    if (sessionExpired && !modalIsOpen) {
      openLoginModal(LOGIN_MODAL_ID, {
        onLoggedIn: markSessionExpiredAsFalse,
        title: "Your session has expired. Please log in again",
        onClose: logout
      });
    } else if (!sessionExpired && modalIsOpen && id === LOGIN_MODAL_ID) {
      closeLoginModal();
    }
  }, [
    sessionExpired,
    modalIsOpen,
    markSessionExpiredAsFalse,
    id,
    logout,
    closeLoginModal,
    openLoginModal
  ]);
  return children;
};

SessionChecker.propTypes = {
  children: PropTypes.node.isRequired
};

export default SessionChecker;
