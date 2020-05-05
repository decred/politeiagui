import { classNames, CopyableText, H4, Text, useTheme } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import PaymentFaucet from "../PaymentFaucet";
import PaymentStatusTag from "../PaymentStatusTag";
import QRCode from "../QRCode";
import styles from "./PaymentComponent.module.css";

const PaymentComponent = ({ address, amount, extraSmall, status }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  return (
    <>
      <div
        className={classNames(
          styles.paywallInfo,
          isDarkTheme && styles.dark,
          "margin-top-l"
        )}>
        <div className={styles.qrcodeWrapper}>
          <QRCode addr={address} />
        </div>
        <div className={classNames(styles.infoWrapper, "margin-left-m")}>
          <H4 weight="bold" className="margin-bottom-xs">
            Send
          </H4>
          <Text>{amount} DCR</Text>
          <H4 weight="bold" className="margin-top-s margin-bottom-xs">
            To address
          </H4>
          <CopyableText
            id="payment-address"
            truncate
            tooltipPlacement={extraSmall ? "bottom" : "right"}>
            {address}
          </CopyableText>
          {!extraSmall && <PaymentStatusTag status={status} />}
        </div>
      </div>
      <PaymentFaucet address={address} amount={amount} />
    </>
  );
};

PaymentComponent.propTypes = {
  address: PropTypes.string,
  amount: PropTypes.number,
  extraSmall: PropTypes.bool,
  status: PropTypes.number,
  mapStatusTag: PropTypes.object
};

export default PaymentComponent;
