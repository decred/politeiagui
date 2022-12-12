import React from "react";
import styles from "./styles.module.css";
import { Message } from "pi-ui";

export function Warning({ children }) {
  return (
    <Message
      kind="warning"
      data-testid="record-form-warning-message"
      className={styles.message}
    >
      {children}
    </Message>
  );
}

export function InfoMessage({ children }) {
  return (
    <Message
      kind="info"
      data-testid="record-form-info-message"
      className={styles.message}
    >
      {children}
    </Message>
  );
}

export function ErrorMessage({ error }) {
  return (
    error && (
      <Message
        kind="error"
        data-testid="record-form-error-message"
        className={styles.message}
      >
        {error.toString()}
      </Message>
    )
  );
}
