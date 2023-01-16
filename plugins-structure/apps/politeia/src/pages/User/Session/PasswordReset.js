import React from "react";
import { PasswordResetForm, useToast } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { getURLSearchParams, router } from "@politeiagui/core/router";

function UserPasswordResetPage() {
  const { username, verificationtoken } = getURLSearchParams();
  const { openToast } = useToast();
  function handleSubmit({ password }) {
    // TODO: call user slice thunks
    console.log("Password Reset!", { password, username, verificationtoken });
    openToast({
      title: "Password has been sucessfully reset",
      body: "You can now login with your new password",
      kind: "success",
    });
    router.navigateTo("/user/login");
  }
  return (
    <div className={styles.page}>
      <PasswordResetForm className={styles.content} onSubmit={handleSubmit} />
    </div>
  );
}

export default UserPasswordResetPage;
