import React from "react";
import Message from "../Message";
import {
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_LACKING_CONFIRMATIONS
} from "../../constants";
import PaymentInfo from "../PaymentInfo";
import PaymentFaucet from "../PaymentFaucet";

const Paywall = ({
  paywallAddress,
  paywallAmount,
  userPaywallStatus,
  userPaywallConfirmations,
  userPaywallTxid,
  isTestnet
}) => {
  const isWaitingConfirmations =
    userPaywallStatus === PAYWALL_STATUS_LACKING_CONFIRMATIONS;

  return userPaywallStatus === PAYWALL_STATUS_PAID ? (
    <Message
      type="success"
      className="account-page-message"
      header="Payment received"
      body={<p>Thank you for your payment, your registration is complete!</p>}
    />
  ) : (
    <div className="paywall-wrapper" style={{ padding: "10px" }}>
      <div className="paywall-content">
        {isWaitingConfirmations ? (
          <p className="paywall-paragraph">
            Your payment was detected and your registration will be complete
            once it reaches the required amount of confirmations.
          </p>
        ) : (
          <React.Fragment>
            <p className="paywall-paragraph">
              To participate on proposals and to submit your own, Politeia
              requires you to pay a small registration fee. This helps keep
              Politeia free of things like spam and vote manipulation.
            </p>
            <p className="paywall-paragraph highlight">
              To complete your registration please follow the instructions
              below:
            </p>
          </React.Fragment>
        )}
        <PaymentInfo
          paywallAddress={paywallAddress}
          amount={paywallAmount}
          paywallStatus={userPaywallStatus}
          paywallConfirmations={userPaywallConfirmations}
          paywallTxid={userPaywallTxid}
          isTestnet={isTestnet}
        />
        {isWaitingConfirmations ? null : (
          <div className="paywall-payment-section">
            <PaymentFaucet
              paywallAddress={paywallAddress}
              paywallAmount={paywallAmount}
            />
          </div>
        )}
        <div style={{ clear: "both" }} />
      </div>
    </div>
  );
};

export default Paywall;
