import React from "react";
import "../../style/Modals.css";

const Modal = ({
  hasAttemptedSubmit,
  onSubmit,
  grantAccess,
  ...props
}) => (
  <div className="modal-wrapper">
    <div className="paywall-header">
      <h2 className="paywall-header-title">Paywall</h2>
    </div>
    <div className="paywall-content">
      <p>Please send exaclty {props.paywallAmount}DCR to <br/>{props.paywallAddress}</p>
    </div>
    <div>
      Status: {
        grantAccess ?  <p>Approved</p> : <p>Waiting for blocks to get mined</p>
      }
    </div>
    <div className="paywall-footer">
      <a className="btn">Pay!</a>
    </div>
  </div>
);

export default Modal;
