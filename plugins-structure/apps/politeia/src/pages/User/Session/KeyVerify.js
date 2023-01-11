import React from "react";
import { useSelector } from "react-redux";
import { Message } from "pi-ui";
import { user } from "@politeiagui/core/user";
import { Error } from "../../../components";
import { VerifyEmailCard } from "../../../components/Card";
import styles from "./styles.module.css";

function UserVerifyKey() {
  const status = useSelector(user.selectStatus);
  const error = useSelector(user.selectError);

  return (
    <div className={styles.page}>
      {status === "succeeded" ? (
        <Message kind="success">
          You have verified and activated your new identity.
        </Message>
      ) : status === "failed" ? (
        <Error error={error} />
      ) : (
        <VerifyEmailCard className={styles.content} />
      )}
    </div>
  );
}

export default UserVerifyKey;
