import React from "react";
import { useDispatch } from "react-redux";
import { user } from "@politeiagui/core/user";
import { router } from "@politeiagui/core/router";
import {
  Join,
  ModalConfirm,
  SignupForm,
  useModal,
} from "@politeiagui/common-ui";
import { Link } from "pi-ui";
import styles from "./styles.module.css";
import message from "../../../assets/copies/before-signup.md";

function ModalBeforeSignup({ onSubmit, email, ...props }) {
  return (
    <ModalConfirm
      message={message}
      title="Before you sign up"
      onCloseSuccess={router.navigateTo("/")}
      successMessage={`The verification e-mail has been sent to ${email}. Please check your inbox and open the verification link within the same browser you used to perform this signup operation.`}
      onSubmit={onSubmit}
      {...props}
    />
  );
}

function UserSignupPage() {
  const dispatch = useDispatch();
  const [open] = useModal();
  function handleSignup({ username, email, password }) {
    open(ModalBeforeSignup, {
      email,
      onSubmit: () =>
        dispatch(
          user.signup({
            email,
            password,
            publickey: "MOCK_THIS_FOR_NOW",
            username,
          })
        ),
    });
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
