import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { VerificationEmailForm } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { Card, H2, Link, P, classNames } from "pi-ui";
import { user } from "@politeiagui/core/user";

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
        <Card
          paddingSize="small"
          className={classNames(styles.content, styles.verifyMessage)}
        >
          <H2>Please check your inbox for your verification email</H2>
          <P>
            Note that, for privacy reasons, Politeia does not disclose whether
            an email address has already been registered. If you don’t receive
            an email:
          </P>
          <ul>
            <li>Check that {email} is the correct address.</li>
            <li>Check your spam folder!</li>
          </ul>
          <P>
            If you're sure you should have received an email, join the{" "}
            <Link href="https://chat.decred.org">#support:decred.org</Link>{" "}
            channel on Matrix to get assistance from Politeia administrators.
          </P>
        </Card>
      )}
    </div>
  );
}

export default UserResendVerificationEmail;
