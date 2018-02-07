import React from "react";

const Modal = ({
  grantAccess,
  paywallAddress,
  paywallAmount,
  payWithFaucet,
  isTestnet
}) => (
  <div className="paywall-wrapper">
    <div className="paywall-header">
      <h2 className="paywall-header-title">Paywall</h2>
    </div>
    <div className="paywall-content">
      <p>Please send exactly {paywallAmount}DCR to <br/>{paywallAddress}</p>
    </div>
    <div>
      Status: {
        grantAccess ?  <p>Payment received</p> : <p>Waiting for payment</p>
      }
    </div>
    <div className="paywall-footer">
      {
        isTestnet === true ? (
          <button onClick={() => payWithFaucet(paywallAddress, paywallAmount)}>
            Pay with Faucet
          </button>) : null
      }
    </div>
  </div>
);

export default Modal;
