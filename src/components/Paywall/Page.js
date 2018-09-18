import React from "react";
import Message from "../Message";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
import {
  PAYWALL_STATUS_PAID
} from "../../constants";
import PaywallStatus from "./Status";
import AddressViewer from "../AddressViewer";


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

  return userPaywallStatus === PAYWALL_STATUS_PAID ? (
    <Message
      type="success"
      className="account-page-message"
      header="Payment received"
      body={(
        <p>Thank you for your payment, your registration is complete!</p>
      )} />
  ) : (
    (
      <div className="paywall-wrapper" style={{ padding: "10px" }}>
        <div className="paywall-content">
          <p className="paywall-paragraph">
           To submit your own proposal, comment on a proposal, up/down vote comments on proposals,
           or vote on a proposal, Politeia requires you to pay a small registration fee ({paywallAmount} DCR).
           This is to prevent proposal spamming and to prevent users from creating multiple
           “sock puppet” accounts to manipulate up/down voting on comments.
          </p>
          <p className="paywall-paragraph highlight">
            To complete your registration and to be able to submit proposals and comments,
            please send exactly <span className="paywall-amount">{paywallAmount} DCR</span>{" "}
            to
          </p>
          <AddressViewer paywallAddress={paywallAddress} />
          <p className="paywall-paragraph">
            Politeia automatically checks for a transaction with this amount sent to
            this address. After you send it and it reaches 2 confirmations, you will
            be approved to submit proposals and comments.
          </p>
          <PaywallStatus
            { ...{ userPaywallStatus, userPaywallConfirmations } }
          />
          <div className="paywall-payment-section">
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
                    Sent transaction{" "}
                    <a
                      className="paywall-payment-sent"
                      href={"https://testnet.dcrdata.org/explorer/tx/" + payWithFaucetTxId}
                      target="_blank">
                      {payWithFaucetTxId}
                    </a>{" "}
                    to the address; it may take a few minutes to be confirmed.
                  </Message>
                ) : null}
              </div>
            ) : null}
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
      </div>
    )
  );
};

export default Paywall;
