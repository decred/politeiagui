import React from "react";
import { useSelector } from "react-redux";
import styles from "./styles.module.css";
import { user } from "@politeiagui/core/user";
import EmailVerified from "../../../components/Static/EmailVerified";
import { Error } from "../../../components";
import { VerifyEmailCard } from "../../../components/Card";

function UserVerifyEmail() {
  const status = useSelector(user.selectStatus);
  const error = useSelector(user.selectError);

  return (
    <div className={styles.page}>
      {status === "succeeded" ? (
        <EmailVerified className={styles.content} />
      ) : status === "failed" ? (
        <Error error={error} />
      ) : (
        <VerifyEmailCard className={styles.content} />
      )}
    </div>
  );
}

export default UserVerifyEmail;
