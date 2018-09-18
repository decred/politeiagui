import {
  PAYWALL_STATUS_WAITING,
  PAYWALL_STATUS_LACKING_CONFIRMATIONS
} from "../../constants";

export const mapPaywallStatusToText = {
  [PAYWALL_STATUS_WAITING]: "Waiting for payment",
  [PAYWALL_STATUS_LACKING_CONFIRMATIONS]: "Waiting for more confirmations"
};

export const mapPaywallStatusToClassName = {
  [PAYWALL_STATUS_WAITING]: "paywall-payment-status-waiting",
  [PAYWALL_STATUS_LACKING_CONFIRMATIONS]: "paywall-payment-status-confirmations"
};
