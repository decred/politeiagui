import React from "react";
import "../../../style/Modals.css";

const Modal = ({
  hasAttemptedSubmit,
  onSubmit,
  isHidden,
  onCloseModal,
  ...props
}) => (
  <div hidden={isHidden} className="paywall-modal-wrapper">
    <div className="modal-paywall-header">
      <h2 className="modal-paywall-header-title">Paywall</h2>
      <a className="modal-paywall-header-close" aria-hidden="true" onClick={onCloseModal}>×</a>
    </div>
    <div className="modal-paywall-content">
      <p>This is the paywall</p>
      <p>{props.paywallAmount}</p><br/>
      <p>{props.paywallAddress}</p>
    </div>
    <div className="modal-paywall-footer">
      <a className="btn">Pay!</a>
    </div>
  </div>
);

export default Modal;
