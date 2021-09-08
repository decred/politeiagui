import { StatusTag } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import {
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_WAITING
} from "src/constants";
import styles from "./PaymentStatusTag.module.css";

const mapPaymentToStatusTag = {
  [PAYWALL_STATUS_WAITING]: (
    <StatusTag
      className={styles.statusTag}
      type="yellowTime"
      text="Waiting for payment"
    />
  ),
  [PAYWALL_STATUS_LACKING_CONFIRMATIONS]: (
    <StatusTag
      className={styles.statusTag}
      type="bluePending"
      text="Waiting for confirmations"
    />
  ),
  [PAYWALL_STATUS_PAID]: (
    <StatusTag
      className={styles.statusTag}
      type="greenCheck"
      data-testid="paywall-status-paid"
      text="Confirmed"
    />
  )
};

const PaymentStatusTag = ({ status }) => {
  return mapPaymentToStatusTag[status] || null;
};

PaymentStatusTag.propTypes = {
  status: PropTypes.number
};

export default PaymentStatusTag;
