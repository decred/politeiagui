import React from "react";
import { useDispatch } from "react-redux";
import { Join, LoginForm } from "@politeiagui/common-ui";
import styles from "./styles.module.css";

import { user } from "@politeiagui/core/user";
import { router } from "@politeiagui/core/router";
import { Link } from "pi-ui";

function UserLoginPage() {
  const dispatch = useDispatch();
  function handleLogin({ email, password }) {
    dispatch(user.login({ email, password })).then(router.navigateTo("/"));
  }
  return (
    <div className={styles.page}>
      <LoginForm className={styles.content} onSubmit={handleLogin} />
      <Join className={styles.links}>
        <Link href="/user/password-reset" data-link>
          Reset Password
        </Link>
        <div>Privacy Policy</div>
        <div>
          Don't have an account?{" "}
          <Link data-link href="/user/signup">
            Create one Here!
          </Link>
        </div>
      </Join>
    </div>
  );
}

export default UserLoginPage;
