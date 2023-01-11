import React from "react";
import { useDispatch } from "react-redux";
import { Join, LoginForm, useModal } from "@politeiagui/common-ui";
import styles from "./styles.module.css";

import { user } from "@politeiagui/core/user";
import { router } from "@politeiagui/core/router";
import { Link } from "pi-ui";
import PrivacyPolicyModal from "../../../components/Modal/PrivacyPolicyModal";

function UserLoginPage() {
  const dispatch = useDispatch();
  const [open] = useModal();
  function handleLogin({ email, password }) {
    dispatch(user.login({ email, password })).then(router.navigateTo("/"));
  }
  function handlePrivacyPolicy() {
    open(PrivacyPolicyModal);
  }
  return (
    <div className={styles.page}>
      <LoginForm className={styles.content} onSubmit={handleLogin} />
      <div className={styles.links}>
        Don't have an account?{" "}
        <Link data-link href="/user/signup">
          Create one Here!
        </Link>
      </div>
      <Join className={styles.links}>
        <Link href="/user/password/request" data-link>
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
