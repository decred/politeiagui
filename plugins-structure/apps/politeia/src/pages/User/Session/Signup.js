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
import { Link, P } from "pi-ui";
import styles from "./styles.module.css";
import message from "../../../assets/copies/before-signup.md";
import PrivacyPolicyModal from "../../../components/Modal/PrivacyPolicyModal";

// MOCK DEV ENV. Handle that on #2855 - [plugin-architecture] Handle
//   Mainnet/Testnet envs
const IS_DEV = true;

const SuccessMessage = ({ email }) => (
  <div>
    <P>
      The verification e-mail has been sent to {email}. Please check your inbox
      and open the verification link within the same browser you used to perform
      this signup operation.
    </P>
    {IS_DEV && (
      <Link
        data-link
        href={`/user/verify?email=${email}&verificationtoken=fake-verification-token`}
      >
        {"[DEV ONLY]"} Verify Email
      </Link>
    )}
  </div>
);

function ModalBeforeSignup({ onSubmit, email, ...props }) {
  return (
    <ModalConfirm
      data-testid="before-signup-modal"
      message={message}
      title="Before you sign up"
      onCloseSuccess={() => router.navigateTo("/")}
      successMessage={<SuccessMessage email={email} />}
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
      onSubmit: () => {
        dispatch(
          user.signup({
            email,
            password,
            publickey: "MOCK_THIS_FOR_NOW",
            username,
          })
        );
      },
    });
  }
  function handlePrivacyPolicy() {
    open(PrivacyPolicyModal);
  }
  return (
    <div className={styles.page}>
      <SignupForm className={styles.content} onSubmit={handleSignup} />
      <div className={styles.links}>
        Already have an account?{" "}
        <Link href="/user/login" data-link>
          Log in!
        </Link>
      </div>
      <Join className={styles.links}>
        <Link href="/user/resend-verification-email" data-link>
          Resend Verification Email
        </Link>
        <div onClick={handlePrivacyPolicy} className={styles.policy}>
          Privacy Policy
        </div>
      </Join>
    </div>
  );
}

export default UserSignupPage;
