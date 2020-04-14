import { useContext } from "react";
import { modalContext } from "src/components/ModalProvider";

export default function useModalContext() {
  return useContext(modalContext);
}
