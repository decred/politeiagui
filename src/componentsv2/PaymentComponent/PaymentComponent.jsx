import { classNames, CopyableText, H4, Text } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import PaymentFaucet from "../PaymentFaucet";
import usePaywall from "src/hooks/api/usePaywall";
import PaymentStatusTag from "../PaymentStatusTag";
import QRCode from "../QRCode";
import styles from "./PaymentComponent.module.css";

const PaymentComponent = ({ address, amount, extraSmall, status }) => {
  const { isPaid } = usePaywall();
  return (
    <>
      <div className={classNames(styles.paywallInfo, "margin-top-l")}>
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
            tooltipPlacement={extraSmall ? "bottom" : "right"}
          >
            {address}
          </CopyableText>
          {!extraSmall && <PaymentStatusTag status={status} />}
        </div>
      </div>
      <PaymentFaucet address={address} amount={amount} isPaid={isPaid} />
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
