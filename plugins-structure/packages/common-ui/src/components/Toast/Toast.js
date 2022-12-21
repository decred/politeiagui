import React, { useEffect } from "react";
import { ButtonIcon, H5, Message, Text } from "pi-ui";
import styles from "./styles.module.css";
import useToast from "./useToast";

export const Toast = ({ timeout = 5000 }) => {
  const { title, body, kind, clearToast } = useToast();
  useEffect(() => {
    setTimeout(() => {
      clearToast();
    }, timeout);
  }, [title, body, clearToast, timeout]);
  return (
    (title || body) && (
      <div className={styles.toast} data-testid="common-ui-toast">
        <ButtonIcon
          type="cancel"
          className={styles.close}
          onClick={clearToast}
        />
        <Message kind={kind}>
          {title && <H5>{title}</H5>}
          {body && <Text>{body}</Text>}
        </Message>
      </div>
    )
  );
};
