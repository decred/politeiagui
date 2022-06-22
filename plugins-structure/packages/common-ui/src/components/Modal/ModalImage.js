import React from "react";
import { Modal } from "pi-ui";
import styles from "./styles.module.css";

export function ModalImage({ src, alt, onClose, show }) {
  return (
    <Modal show={show} onClose={onClose}>
      <img src={src} alt={alt} className={styles.modalImage} />
    </Modal>
  );
}
