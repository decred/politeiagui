import { classNames, CopyableText, H4, Modal, P, StatusTag, Text, useMediaQuery } from "pi-ui";
import React from "react";
import { PAYWALL_STATUS_LACKING_CONFIRMATIONS, PAYWALL_STATUS_PAID, PAYWALL_STATUS_WAITING } from "src/constants";
import PaymentFaucet from "../PaymentFaucet/PaymentFaucet";
import QRCode from "../QRCode";
import styles from "./ModalPayPaywall.module.css";

const mapPaywallStatusToStatusTag = {
  [PAYWALL_STATUS_WAITING]: <StatusTag className={styles.statusTag} type="yellowTime" text="Waiting for payment" />,
  [PAYWALL_STATUS_LACKING_CONFIRMATIONS]: <StatusTag className={styles.statusTag} type="yellowTime" text="Waiting for confirmations" />,
  [PAYWALL_STATUS_PAID]: <StatusTag className={styles.statusTag} type="greenCheck" text="Confirmed" />
};

const ModalPayPaywall = ({ show, title, onClose, address, amount, status }) => {
  const isPaid = status === PAYWALL_STATUS_PAID;
  const extraSmall = useMediaQuery("(max-width: 560px)");
  return (
    <Modal show={show} title={title} onClose={onClose}>
      {extraSmall && mapPaywallStatusToStatusTag[status]}
      <P className={styles.paywallDescription}>To participate on proposals and to submit your own, Politeia requires you to pay a small registration fee of <Text weight="bold">exactly {amount} DCR.</Text> This helps keep Politeia free of things like spam and comment manipulation.</P>
      <div className={classNames(styles.paywallInfo, "margin-top-l")}>
        <div className={styles.qrcodeWrapper}>
          <QRCode addr={address} />
        </div>
        <div className={classNames(styles.infoWrapper, "margin-left-m")}>
          <H4 weight="bold" className="margin-bottom-xs">Send</H4>
          <Text>{amount} DCR</Text>
          <H4 weight="bold" className="margin-top-s margin-bottom-xs">To address</H4>
          <CopyableText truncate>{address}</CopyableText>
          {!extraSmall && mapPaywallStatusToStatusTag[status]}
        </div>
      </div>
      <PaymentFaucet address={address} amount={amount} isPaid={isPaid} />
    </Modal>
  );
};


export default ModalPayPaywall;
