import React from "react";
import PropTypes from "prop-types";
import { Button, Message, Modal, Text } from "pi-ui";
import { MarkdownRenderer } from "../Markdown";
import externalLinkWarning from "../../assets/copies/external-link.md";
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
        <MarkdownRenderer body={externalLinkWarning} />
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
        <Button
          data-testid="modal-external-link-confirm-button"
          onClick={onProceed}
        >
          Yes, proceed
        </Button>
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
