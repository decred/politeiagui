import React from "react";
import { ButtonIcon, H5, Message, Text } from "pi-ui";
import styles from "./styles.module.css";
import useToast from "./useToast";

export const Toast = () => {
  const { title, body, kind, clearToast } = useToast();
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
