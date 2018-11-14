import React from "react";
import { mapPaywallStatusToText, mapPaywallStatusToClassName } from "./helpers";
import { PAYWALL_STATUS_LACKING_CONFIRMATIONS } from "../../constants";

const PaywallStatus = ({ userPaywallStatus, userPaywallConfirmations }) => {
  const className = mapPaywallStatusToClassName[userPaywallStatus];
  const text = mapPaywallStatusToText[userPaywallStatus];
  return (
    <div className={"paywall-payment-status " + className}>
      Status: {text}
      {userPaywallStatus === PAYWALL_STATUS_LACKING_CONFIRMATIONS && (
        <span>{` (${userPaywallConfirmations}/2)`}</span>
      )}
    </div>
  );
};

export default PaywallStatus;
