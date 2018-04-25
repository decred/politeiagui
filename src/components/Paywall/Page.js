import React from "react";
import QRCode from "../QRCode";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
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
  userPaywallConfirmations,
  isTestnet,
  isApiRequestingPayWithFaucet
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
  default:
    //throw new Error("User paywall status " + userPaywallStatus + " not supported");
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
      <QRCode addr={paywallAddress} />
      <div className={"paywall-payment-status " + userPaywallStatusCls}>
        Status: {userPaywallStatusText}
        {userPaywallStatus === PAYWALL_STATUS_LACKING_CONFIRMATIONS &&
          <span>{` (${userPaywallConfirmations}/2)`}</span>
        }
      </div>
      {isTestnet ? (
        <div className="paywall-faucet">
          <p>
            This Politeia instance is running on Testnet, which means you can pay
            automatically with the Decred faucet:
          </p>
          <ButtonWithLoadingIcon
            className="c-btn c-btn-primary"
            text="Pay with Faucet"
            disabled={userPaywallStatus === PAYWALL_STATUS_PAID}
            isLoading={isApiRequestingPayWithFaucet}
            onClick={() => payWithFaucet(paywallAddress, paywallAmount)} />
        </div>
      ) : null}
    </div>
  );
};

export default Modal;
