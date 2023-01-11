import React from "react";
import styles from "./styles.module.css";
import { Card, H2, Link, P, classNames } from "pi-ui";

function VerifyEmailCard({ email, className }) {
  return (
    <Card
      paddingSize="small"
      className={classNames(styles.verifyMessage, className)}
    >
      <H2>Please check your inbox for your verification email</H2>
      <P>
        Note that, for privacy reasons, Politeia does not disclose whether an
        email address has already been registered. If you don’t receive an
        email:
      </P>
      <ul>
        {email && <li>Check that {email} is the correct address.</li>}
        <li>Check your spam folder!</li>
      </ul>
      <P>
        If you're sure you should have received an email, join the{" "}
        <Link href="https://chat.decred.org">#support:decred.org</Link> channel
        on Matrix to get assistance from Politeia administrators.
      </P>
    </Card>
  );
}

export default VerifyEmailCard;
