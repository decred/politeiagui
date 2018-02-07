import React from "react";

const Modal = ({
  grantAccess,
  ...props
}) => (
  <div className="paywall-wrapper">
    <div className="paywall-header">
      <h2 className="paywall-header-title">Paywall</h2>
    </div>
    <div className="paywall-content">
      <p>Please send exactly {props.paywallAmount}DCR to <br/>{props.paywallAddress}</p>
    </div>
    <div>
      Status: {
        grantAccess ?  <p>Payment received</p> : <p>Waiting for payment</p>
      }
    </div>
    <div className="paywall-footer">
    </div>
  </div>
);

export default Modal;
