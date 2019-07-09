import { classNames, H4, Modal, P, StatusTag, Text } from "pi-ui";
import React from "react";
import { PAYWALL_STATUS_LACKING_CONFIRMATIONS, PAYWALL_STATUS_PAID, PAYWALL_STATUS_WAITING } from "src/constants";
import PaymentFaucet from "../PaymentFaucet/PaymentFaucet";
import QRCode from "../QRCode";
import CopyToClipboard from "./assets/CopyToClipboard.svg";
import styles from "./ModalPayPaywall.module.css";
import { copyToClipboard as copy } from "src/helpers";

const mapPaywallStatusToStatusTag = {
  [PAYWALL_STATUS_WAITING]: <StatusTag type="yellowTime" text="Waiting for payment" />,
  [PAYWALL_STATUS_LACKING_CONFIRMATIONS]: <StatusTag type="yellowTime" text="Waiting for approval" />,
  [PAYWALL_STATUS_PAID]: <StatusTag type="greenCheck" text="Confirmed" />
};

const ModalPayPaywall = ({ show, title, onClose, address, amount, status }) => {
  const isPaid = status === PAYWALL_STATUS_PAID;
  return (
    <Modal show={show} title={title} onClose={onClose}>
      <P>To participate on proposals and to submit your own, Politeia requires you to pay a small registration fee of <Text weight="bold">exactly {amount} DCR.</Text> This helps keep Politeia free of things like spam and vote manipulation.</P>
      <div className={classNames(styles.paywallInfo, "margin-top-l")}>
        <div className={styles.qrcodeWrapper}>
          <QRCode addr={address} />
        </div>
        <div className={classNames(styles.infoWrapper, "margin-left-m")}>
          <H4 weight="bold" className="margin-bottom-xs">Send</H4>
          <Text>{amount} DCR</Text>
          <H4 weight="bold" className="margin-top-s margin-bottom-xs">To address</H4>
          <div>
            <span className={styles.addressWrapper}>
              <Text>{address}</Text>
            </span>
            <img className={classNames(styles.copyToClipboard, "margin-left-xs")} onClick={() => copy(address)} src={CopyToClipboard} alt="copy to clipboard" />
          </div>
          <div className={styles.statusTag}>
            {mapPaywallStatusToStatusTag[status]}
          </div>
        </div>
      </div>
      <PaymentFaucet address={address} amount={amount} isPaid={isPaid} />
    </Modal>
  );
};


export default ModalPayPaywall;
