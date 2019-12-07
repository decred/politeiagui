import React from "react";
import resendVerificationEmailNext from "../../connectors/resendVerificationEmailNext";

const SuccessPage = ({ email }) => (
  <div className="page resend-verification-next-step-page content">
    <div className="text-wrapper">
      <div className="centered">
        <h3>Please check your inbox for your verification email.</h3>
        <p>
          Note that, for privacy reasons, Politeia does not disclose whether an
          email address has been registered. If you don't receive an email:
        </p>
        <ul>
          {email ? (
            <li>
              Check that <span className="email-address">{email}</span> is the
              correct address.
            </li>
          ) : null}
          <li>Check your spam folder!</li>
        </ul>
        <p>
          If you're sure you should have received an email, join the{" "}
          <code>#support:decred.org</code> channel on{" "}
          <a href="https://www.decred.org/matrix/">Matrix</a> to get assistance
          from Politeia administrators.
        </p>
      </div>
    </div>
  </div>
);

export default resendVerificationEmailNext(SuccessPage);
