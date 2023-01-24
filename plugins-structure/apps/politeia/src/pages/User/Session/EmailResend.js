import React, { useState } from "react";
import { Link } from "pi-ui";
import { useDispatch } from "react-redux";
import { VerificationEmailForm } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { user } from "@politeiagui/core/user";
import { VerifyEmailCard } from "../../../components/Card";

// MOCK DEV ENV. Handle that on #2855 - [plugin-architecture] Handle
//   Mainnet/Testnet envs
const IS_DEV = true;

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
        <>
          <VerifyEmailCard email={email} className={styles.content} />
          {IS_DEV && (
            <Link
              data-link
              href={`/user/verify?email=${email}&verificationtoken=fake-verification-token`}
            >
              {"[DEV ONLY]"} Verify Action
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default UserResendVerificationEmail;
