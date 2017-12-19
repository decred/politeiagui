import React from "react";
import signupNext from "../connectors/signupNext";

const SignupNextStepPage = ({ email }) => (
  <div className="page signup-next-step-page">
    <h3>Please check your inbox to verify your registration.</h3>
    <p>
      Note that for privacy reasons, Politeia does not disclose whether
      an email address has already been registered. If you don't receive
      an email:
    </p>
    <ul>
      {email ? (
        <li>
          Check that <span className="email-address">{email}</span> is the
          correct address.
        </li>
      ) : null}
      <li>Check your spam folder!</li>
      <li>
        Make sure you don't already have an account on Politeia with this
        email address. If you do, you should <a href="/password">reset your
        account</a> instead.
      </li>
    </ul>
    <p>
      If you're sure you should have received an email, join the <code>#support</code> channel
      on <a href="https://docs.decred.org/support-directory/#join-us-on-slack">our
      Slack</a> to get assistance from Politeia administrators.
    </p>
  </div>
);

export default signupNext(SignupNextStepPage);
