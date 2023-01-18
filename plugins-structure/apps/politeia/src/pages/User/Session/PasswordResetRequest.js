import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "pi-ui";
import { user } from "@politeiagui/core/user";
import { PasswordResetForm } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { VerifyEmailCard } from "../../../components/Card";

// MOCK DEV ENV. Handle that on #2855 - [plugin-architecture] Handle
//   Mainnet/Testnet envs
const IS_DEV = true;

function UserPasswordResetRequestPage() {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const dispatch = useDispatch();

  function handleSubmit({ username, email }) {
    dispatch(user.passwordRequest({ username, email })).then(() => {
      setUsername(username);
      setEmail(email);
    });
  }
  return (
    <div className={styles.page}>
      {!email ? (
        <PasswordResetForm
          className={styles.content}
          onSubmit={handleSubmit}
          requestMode
        />
      ) : (
        <>
          <VerifyEmailCard email={email} className={styles.content} />
          {IS_DEV && (
            <Link
              data-link
              href={`/user/password/reset?username=${username}&verificationtoken=fake-verification-token`}
            >
              {"[DEV ONLY]"} Verify Action
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default UserPasswordResetRequestPage;
