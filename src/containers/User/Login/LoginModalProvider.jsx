import React, { createContext, useContext } from "react";
import ModalProvider from "src/componentsv2/ModalProvider";
import ModalLogin from "src/componentsv2/ModalLogin";

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
