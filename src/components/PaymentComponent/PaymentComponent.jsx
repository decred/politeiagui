import {
  classNames,
  CopyableText,
  H4,
  Text,
  useTheme,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import PaymentFaucet from "../PaymentFaucet";
import PaymentStatusTag from "../PaymentStatusTag";
import QRCode from "../QRCode";
import styles from "./PaymentComponent.module.css";

const PaymentComponent = ({ address, amount, extraSmall, status }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  return (
    <>
      <div
        data-testid="payment-component"
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
            id="component-payment-address"
            truncate
            tooltipPlacement={"bottom"}>
            {address}
          </CopyableText>
          {!extraSmall && (
            <span data-testid="payment-status-tag">
              <PaymentStatusTag status={status} />
            </span>
          )}
        </div>
      </div>
      <PaymentFaucet address={address} amount={amount} />
    </>
  );
};

PaymentComponent.propTypes = {
  address: PropTypes.string,
  amount: PropTypes.number,
  status: PropTypes.number,
  mapStatusTag: PropTypes.object
};

export default PaymentComponent;
