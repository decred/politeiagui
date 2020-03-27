import React, { createContext, useContext } from "react";
import ModalProvider from "src/components/ModalProvider";
import ModalLogin from "src/components/ModalLogin";

const loginModalContext = createContext();
export const useLoginModal = () => useContext(loginModalContext);

const LoginModalProvider = ({ children }) => {
  return (
    <ModalProvider context={loginModalContext} modal={<ModalLogin />}>
      {children}
    </ModalProvider>
  );
};

export default LoginModalProvider;
