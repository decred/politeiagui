import React from "react";
import { useSelector } from "react-redux";
import { getURLSearchParams } from "@politeiagui/core/router";
import { userAuth } from "@politeiagui/core/user/auth";
import EmailVerified from "../../../components/Static/EmailVerified";
import { Error } from "../../../components";
import { VerifyEmailCard } from "../../../components/Card";
import styles from "./styles.module.css";

function UserVerifyEmail() {
  const status = useSelector(userAuth.selectStatus);
  const error = useSelector(userAuth.selectError);
  const { email } = getURLSearchParams();

  return (
    <div className={styles.page}>
      {status === "succeeded" ? (
        <EmailVerified className={styles.content} />
      ) : status === "failed" ? (
        <Error error={error} />
      ) : (
        <VerifyEmailCard className={styles.content} email={email} />
      )}
    </div>
  );
}

export default UserVerifyEmail;
