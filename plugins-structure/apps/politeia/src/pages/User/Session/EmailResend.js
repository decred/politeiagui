import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { VerificationEmailForm } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { user } from "@politeiagui/core/user";
import { VerifyEmailCard } from "../../../components/Card";

function UserResendVerificationEmail() {
  const [email, setEmail] = useState();
  const dispatch = useDispatch();
  function handleResendEmail({ username, email }) {
    dispatch(user.resendEmail({ email, username })).then(() => {
      setEmail(email);
    });
  }
  return (
    <div className={styles.page}>
      {!email ? (
        <VerificationEmailForm
          onSubmit={handleResendEmail}
          className={styles.content}
        />
      ) : (
        <VerifyEmailCard email={email} />
      )}
    </div>
  );
}

export default UserResendVerificationEmail;
