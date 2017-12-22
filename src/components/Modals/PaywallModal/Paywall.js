import React from "react";
import "../../../style/Modals.css";

const Modal = ({
  hasAttemptedSubmit,
  onSubmit,
  isHidden
}) => (
  <div hidden={isHidden}>
    this is the paywall modal
  </div>
);

export default Modal;
