import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAuth } from "@politeiagui/core/user/auth";
import { router } from "@politeiagui/core/router";
import {
  Join,
  ModalConfirm,
  SignupForm,
  useModal,
} from "@politeiagui/common-ui";
import { Link, P } from "pi-ui";
import styles from "./styles.module.css";
import { buildRegexFromSupportedChars } from "../../../pi/policy/utils";
import message from "../../../assets/copies/before-signup.md";
import PrivacyPolicyModal from "../../../components/Modal/PrivacyPolicyModal";
import { apiPolicy } from "@politeiagui/core/api";

// MOCK DEV ENV. Handle that on #2855 - [plugin-architecture] Handle
//   Mainnet/Testnet envs
const IS_DEV = true;

const DevVerifyLink = ({ email, username }) => {
  const verificationtoken = useSelector(userAuth.selectVerificationToken);
  return (
    IS_DEV && (
      <Link
        data-link
        href={`/user/verify?email=${email}&verificationtoken=${verificationtoken}&username=${username}`}
      >
        {"[DEV ONLY]"} Verify Email
      </Link>
    )
  );
};

const SuccessMessage = ({ email, username }) => {
  return (
    <div>
      <P>
        The verification e-mail has been sent to {email}. Please check your
        inbox and open the verification link within the same browser you used to
        perform this signup operation.
      </P>
      <DevVerifyLink email={email} username={username} />
    </div>
  );
};

function ModalBeforeSignup({ onSubmit, email, username, ...props }) {
  return (
    <ModalConfirm
      data-testid="before-signup-modal"
      message={message}
      title="Before you sign up"
      onCloseSuccess={() => router.navigateTo("/")}
      successMessage={<SuccessMessage email={email} username={username} />}
      onSubmit={onSubmit}
      {...props}
    />
  );
}

function UserSignupPage() {
  const dispatch = useDispatch();
  const [open] = useModal();
  const policy = useSelector(apiPolicy.select);

  function handleSignup({ username, email, password }) {
    open(ModalBeforeSignup, {
      email,
      username,
      onSubmit: () => {
        dispatch(userAuth.signup({ email, password, username }));
      },
    });
  }
  function handlePrivacyPolicy() {
    open(PrivacyPolicyModal);
  }
  return (
    <div className={styles.page}>
      <SignupForm
        className={styles.content}
        onSubmit={handleSignup}
        usernameValidationRegex={buildRegexFromSupportedChars(
          policy?.usernamesupportedchars
        )}
        minpasswordlength={policy?.minpasswordlength}
      />
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
