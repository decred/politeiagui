import PropTypes from "prop-types";
import React from "react";
import { useSessionChecker } from "./hooks";
import ModalLogin from "src/componentsv2/ModalLogin";
import useNavigation from "src/hooks/useNavigation";

const SessionChecker = ({ children }) => {
  const { sessionExpired, setSessionExpired } = useSessionChecker();
  const { onLogout } = useNavigation();
  const closeLogin = () => {
    setSessionExpired(false);
  };
  const logout = () => {
    onLogout();
    closeLogin();
  };
  return (
    <>
      <ModalLogin
        onLoggedIn={closeLogin}
        onDismissModal={logout}
        show={sessionExpired}
      />
      {children}
    </>
  );
};

SessionChecker.propTypes = {
  children: PropTypes.object.isRequired
};

export default SessionChecker;
