import PropTypes from "prop-types";
import React from "react";
import { useSessionChecker } from "./hooks";
import ModalLogin from "src/componentsv2/ModalLogin";
import useNavigation from "src/hooks/useNavigation";

const SessionChecker = ({ children }) => {
  const { sessionExpired, setSessionExpired } = useSessionChecker();
  const { handleLogout } = useNavigation();
  const closeLogin = () => {
    setSessionExpired(false);
  };
  const logout = () => {
    handleLogout();
    closeLogin();
  };
  return (
    <>
      <ModalLogin
        onLoggedIn={closeLogin}
        onClose={logout}
        show={sessionExpired}
        title={"Your session has expired. Please log in again"}
      />
      {children}
    </>
  );
};

SessionChecker.propTypes = {
  children: PropTypes.node.isRequired
};

export default SessionChecker;
