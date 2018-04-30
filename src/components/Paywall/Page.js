import React from "react";
import Message from "../Message";
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
  }

  return userPaywallStatus === PAYWALL_STATUS_PAID ? (
    <Message
      type="success"
      className="account-page-message"
      header="Payment received"
      body={(
        <div className="paywall-wrapper">
          <div className="paywall-content">
            <p>
              Your payment was received and your registration has been completed!
            </p>
          </div>
        </div>
      )} />
  ) : (
    <Message
      type="error"
      className="account-page-message"
      header="Action Needed"
      body={(
        <div className="paywall-wrapper">
          <div className="paywall-content">
            <p>
              To complete your registration and to be able to submit proposals and comments,
              please send exactly <span className="paywall-amount">{paywallAmount} DCR</span>{" "}
              to <span className="paywall-address">{paywallAddress}</span>.
            </p>
            <p>
              Politeia automatically checks for a transaction with this amount sent to
              this address. After you send it and it reaches 2 confirmations, you will
              be approved to submit proposals and comments.
            </p>
            <div className={"paywall-payment-status " + userPaywallStatusCls}>
              Status: {userPaywallStatusText}
              {userPaywallStatus === PAYWALL_STATUS_LACKING_CONFIRMATIONS &&
                <span>{` (${userPaywallConfirmations}/2)`}</span>
              }
            </div>
            <QRCode addr={paywallAddress} />
            {isTestnet ? (
              <div className="paywall-faucet">
                <div className="paywall-faucet-testnet">Testnet</div>
                <p>
                  This Politeia instance is running on Testnet, which means you can pay
                  with the Decred faucet:
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
        </div>
      )} />
  );
};

export default Modal;
