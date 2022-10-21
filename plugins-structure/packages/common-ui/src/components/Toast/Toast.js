import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonIcon, H5, Message, Text } from "pi-ui";
import { message } from "@politeiagui/core/globalServices";
import styles from "./styles.module.css";

export const Toast = ({ timeout = 5000, kind = "error" }) => {
  const dispatch = useDispatch();
  const msg = useSelector(message.select);
  useEffect(() => {
    setTimeout(() => {
      dispatch(message.clear());
    }, timeout);
  }, [msg, dispatch, timeout]);
  return (
    (msg.title || msg.body) && (
      <div className={styles.toast} data-testid="common-ui-toast">
        <ButtonIcon
          type="cancel"
          className={styles.close}
          onClick={() => dispatch(message.clear())}
        />
        <Message kind={kind}>
          {msg.title && <H5>{msg.title}</H5>}
          {msg.body && <Text>{msg.body}</Text>}
        </Message>
      </div>
    )
  );
};
