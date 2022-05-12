import React from "react";
import PropTypes from "prop-types";
import { Button, Message, Modal, P, Text } from "pi-ui";
import styles from "./styles.module.css";

export function ModalExternalLink({ show, onClose, link, title, onConfirm }) {
  const tmpLink = document.createElement("a");
  tmpLink.href = link;
  function onProceed() {
    onConfirm && onConfirm();
    const newWindow = window.open();
    newWindow.opener = null;
    newWindow.location.href = link;
    newWindow.target = "_blank";
    onClose();
  }
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={title}
      contentClassName={styles.modalExternalLink}
    >
      <Message kind="warning">
        <P>
          {" "}
          You are about to be sent to an external website. This can result in
          unintended consequences.
          <strong> DO NOT</strong> enter your credentials or reveal any other
          sensitive information.
          <strong> DO NOT</strong> download or run any linked files on the
          computer storing your cryptocurrencies.
        </P>
      </Message>
      <div>
        <Text weight="bold">External link:</Text>
        <div className={styles.modalExternalLinkUrl}>
          <Text>{tmpLink.protocol + "//"}</Text>
          <Text color="orange">{tmpLink.hostname}</Text>
          <Text>{tmpLink.pathname + tmpLink.search + tmpLink.hash}</Text>
        </div>
      </div>
      <div className={styles.center}>
        <Text weight="semibold">Are you sure you want to open this link?</Text>
      </div>
      <div className={styles.right}>
        <Button onClick={onProceed}>Yes, proceed</Button>
      </div>
    </Modal>
  );
}

ModalExternalLink.propTypes = {
  link: PropTypes.string.isRequired,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.node,
};

ModalExternalLink.defaultProps = {
  title: "Warning!",
};
