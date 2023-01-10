import React from "react";
import { PasswordResetForm } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { getURLSearchParams, router } from "@politeiagui/core/router";

function UserPasswordResetPage() {
  const { username, verificationtoken } = getURLSearchParams();
  function handleSubmit({ password }) {
    // TODO: call user slice thunks
    console.log("Password Reset!", { password, username, verificationtoken });
    // TODO: Before navigating to login, call Toast service with useToast hook
    // from #2884 and display a success message.
    router.navigateTo("/user/login");
  }
  return (
    <div className={styles.page}>
      <PasswordResetForm className={styles.content} onSubmit={handleSubmit} />
    </div>
  );
}

export default UserPasswordResetPage;
