import React from "react";
import { useDispatch } from "react-redux";
import { Join, LoginForm, useModal, useToast } from "@politeiagui/common-ui";
import styles from "./styles.module.css";

import { userAuth } from "@politeiagui/core/user/auth";
import { router } from "@politeiagui/core/router";
import { Link } from "pi-ui";
import PrivacyPolicyModal from "../../../components/Modal/PrivacyPolicyModal";

function UserLoginPage() {
  const dispatch = useDispatch();
  const [open] = useModal();
  const { openToast } = useToast();

  function handleLogin({ email, password }) {
    dispatch(userAuth.login({ email, password }))
      .unwrap()
      .then(() => {
        router.navigateTo("/");
      })
      .catch((e) => {
        // TODO: handle 2fa
        openToast({ kind: "error", title: "Login error", body: e });
      });
  }

  function handlePrivacyPolicy() {
    open(PrivacyPolicyModal);
  }
  return (
    <div className={styles.page}>
      <LoginForm className={styles.content} onSubmit={handleLogin} />
      <div className={styles.links}>
        Don't have an account?{" "}
        <Link data-link href="/user/signup" data-testid="login-signup-link">
          Create one Here!
        </Link>
      </div>
      <Join className={styles.links}>
        <Link
          href="/user/password/request"
          data-link
          data-testid="login-reset-password-link"
        >
          Reset Password
        </Link>
        <div onClick={handlePrivacyPolicy} className={styles.policy}>
          Privacy Policy
        </div>
      </Join>
    </div>
  );
}

export default UserLoginPage;
