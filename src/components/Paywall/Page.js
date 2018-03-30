import React from "react";
import {
  PAYWALL_STATUS_WAITING,
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_PAID
} from "../../constants";


const Modal = ({
  paywallAddress,
  paywallAmount,
  payWithFaucet,
  userPaywallStatus,
  isTestnet
}) => {
  let userPaywallStatusCls;
  let userPaywallStatusText;
  switch(userPaywallStatus) {
  case PAYWALL_STATUS_WAITING:
    userPaywallStatusCls = "paywall-payment-status-waiting";
    userPaywallStatusText = "Waiting for payment";
    break;
  case PAYWALL_STATUS_LACKING_CONFIRMATIONS:
    userPaywallStatusCls = "paywall-payment-status-confirmations";
    userPaywallStatusText = "Waiting for more confirmations";
    break;
  case PAYWALL_STATUS_PAID:
    userPaywallStatusCls = "paywall-payment-status-received";
    userPaywallStatusText = "Payment received";
    break;
  }

  return (
    <div className="paywall-wrapper">
      <div className="paywall-content">
        Please send exactly <span className="paywall-amount">{paywallAmount} DCR</span> to{" "}
        <span className="paywall-address">{paywallAddress}</span> to complete your
        account registration. Politeia automatically checks for a transaction with
        this amount sent to this address. After you send it and it reaches 2 confirmations, you
        will be approved to submit proposals and comments.
      </div>
      <div className={"paywall-payment-status " + userPaywallStatusCls}>
        Status: {userPaywallStatusText}
      </div>
      {isTestnet ? (
        <div className="paywall-faucet">
          <p>
            Politeia is currently running on Testnet, which means you can pay
            automatically with the Decred faucet:
          </p>
          <button onClick={() => payWithFaucet(paywallAddress, paywallAmount)}>
            Pay with Faucet
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Modal;
