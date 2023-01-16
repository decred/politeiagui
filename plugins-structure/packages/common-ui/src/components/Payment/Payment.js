import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { generateQrCode } from "@politeiagui/core";
import styles from "./styles.module.css";
import { CopyableText, StatusTag } from "pi-ui";

export const Payment = ({ value = 0, address, id = "payment" }) => {
  const [code, setCode] = useState();
  useEffect(() => {
    generateQrCode(`decred:${address}`).then((c) => setCode(c));
  }, [address]);
  return (
    <div className={styles.payment}>
      <div className={styles.tag}>
        <StatusTag text="Waiting Payment" type="yellowTime" />
      </div>
      <img src={code} alt={address} data-testid="payment-code" />
      <div className={styles.instructions}>
        <div>
          <b>Send:</b>
        </div>
        <span data-testid="payment-value">{value} DCR</span>
        <div>
          <b>To:</b>
          <CopyableText data-testid="payment-address" id={id}>
            {address}
          </CopyableText>
        </div>
      </div>
    </div>
  );
};

Payment.propTypes = {
  address: PropTypes.string.isRequired,
  value: PropTypes.number,
};
