import { Modal, P, Text, useMediaQuery } from "pi-ui";
import React from "react";
import { PAYWALL_STATUS_PAID } from "src/constants";
import usePaywall from "src/hooks/usePaywall";
import PaymentComponent from "../PaymentComponent";
import PaymentStatusTag from "../PaymentStatusTag";
import styles from "./ModalPayPaywall.module.css";

const ModalPayPaywall = ({ show, title, onClose }) => {
  const { userPaywallStatus, paywallAmount, paywallAddress } = usePaywall();
  const isPaid = userPaywallStatus === PAYWALL_STATUS_PAID;
  const extraSmall = useMediaQuery("(max-width: 560px)");
  return (
    <Modal show={show} title={title} onClose={onClose}>
      {extraSmall && <PaymentStatusTag status={userPaywallStatus} />}
      <P className={styles.paywallDescription}>
        To participate on proposals and to submit your own, Politeia requires
        you to pay a small registration fee of{" "}
        <Text weight="bold">exactly {paywallAmount} DCR.</Text> This helps keep
        Politeia free of things like spam and comment manipulation.
      </P>
      <PaymentComponent
        address={paywallAddress}
        amount={paywallAmount}
        extraSmall={extraSmall}
        isPaid={isPaid}
        status={userPaywallStatus}
      />
    </Modal>
  );
};

export default ModalPayPaywall;
