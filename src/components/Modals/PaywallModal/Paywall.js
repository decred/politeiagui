import React from "react";
import "../../../style/Modals.css";

const Modal = ({
  hasAttemptedSubmit,
  onSubmit,
  isHidden
}) => (
  <div className="paywall-modal-wrapper">
    <div className="modal-paywall-header">
      <h2 className="modal-paywall-header-title">Paywall</h2>
      <a href="#" className="modal-paywall-header-close" aria-hidden="true">×</a>
    </div>
    <div className="modal-paywall-content">
      <p>This is the paywall</p>
    </div>
    <div className="modal-paywall-footer">
      <a href="#" class="btn">Pay!</a>
    </div>
  </div>
);

export default Modal;
