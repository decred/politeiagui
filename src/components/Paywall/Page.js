import React from "react";
import Message from "../Message";
import QRCode from "../QRCode";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
import {
  PAYWALL_STATUS_WAITING,
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_PAID
} from "../../constants";


const Paywall = ({
  paywallAddress,
  paywallAmount,
  payWithFaucet,
  userPaywallStatus,
  userPaywallConfirmations,
  isTestnet,
  isApiRequestingPayWithFaucet,
  payWithFaucetTxId,
  payWithFaucetError
}) => {
  let userPaywallStatusCls;
  let userPaywallStatusText;

  if (userPaywallStatus === PAYWALL_STATUS_WAITING) {
    userPaywallStatusCls = "paywall-payment-status-waiting";
    userPaywallStatusText = "Waiting for payment";
  }
  else if (userPaywallStatus === PAYWALL_STATUS_LACKING_CONFIRMATIONS) {
    userPaywallStatusCls = "paywall-payment-status-confirmations";
    userPaywallStatusText = "Waiting for more confirmations";
  }

  return userPaywallStatus === PAYWALL_STATUS_PAID ? (
    <Message
      type="success"
      className="account-page-message"
      header="Payment received"
      body={(
        <div className="paywall-wrapper">
          <div className="paywall-content">
            <p>Thank you for your payment, your registration is complete!</p>
          </div>
        </div>
      )} />
  ) : (
    <Message
      type="error"
      className="account-page-message"
      header="Action needed"
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
            <div className="paywall-payment-section">
              <div className={"paywall-payment-status " + userPaywallStatusCls}>
                Status: {userPaywallStatusText}
                {userPaywallStatus === PAYWALL_STATUS_LACKING_CONFIRMATIONS &&
                  <span>{` (${userPaywallConfirmations}/2)`}</span>
                }
              </div>
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
                  {payWithFaucetError ? (
                    <Message
                      type="error"
                      header="Faucet error"
                      body={payWithFaucetError} />
                  ) : null }
                  {payWithFaucetTxId ? (
                    <Message
                      type="info"
                      header="Sent payment">
                      Sent transaction <a href={"https://testnet.dcrdata.org/explorer/tx/" + payWithFaucetTxId}>{payWithFaucetTxId}</a> to the address; it may take a few minutes to be confirmed.
                    </Message>
                  ) : null}
                </div>
              ) : null}
            </div>
            <QRCode addr={paywallAddress} />
            <div style={{clear:"both"}}></div>
          </div>
        </div>
      )} />
  );
};

export default Paywall;
