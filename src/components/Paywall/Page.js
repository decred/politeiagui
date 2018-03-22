import React from "react";

const Modal = ({
  hasPaid,
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
      Please send exactly {paywallAmount} DCR to <br/>
      <div className="paywall-address">{paywallAddress}</div>
    </div>
    <div className={hasPaid ? "paywall-payment-received" : "paywall-waiting-payment"}>
      Status: {
        hasPaid ?  <p>Payment received</p> : <p>Waiting for payment</p>
      }
    </div>
    <div className="paywall-footer">
      {
        isTestnet ? (
          <button onClick={() => payWithFaucet(paywallAddress, paywallAmount)}>
            Pay with Faucet
          </button>
        ) : null
      }
    </div>
  </div>
);

export default Modal;
