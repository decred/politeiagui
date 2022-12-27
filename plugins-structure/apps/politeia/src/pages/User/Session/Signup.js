import { Join, SignupForm } from "@politeiagui/common-ui";
import { user } from "@politeiagui/core/user";
import { Link } from "pi-ui";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "./styles.module.css";

function UserSignupPage() {
  const dispatch = useDispatch();
  function handleSignup({ username, email, password }) {
    dispatch(
      user.signup({ email, password, publickey: "MOCK_THIS_FOR_NOW", username })
    );
  }
  return (
    <div className={styles.page}>
      <SignupForm className={styles.content} onSubmit={handleSignup} />
      <Join>
        <Link href="/user/resend-verification-email" data-link>
          Resend Verification Email
        </Link>
        <span>
          Already have an account? <Link href="/user/login">Log in!</Link>
        </span>
      </Join>
    </div>
  );
}

export default UserSignupPage;
