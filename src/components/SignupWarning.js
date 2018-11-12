import React from "react";
const SignupWarning = () => {
  return (
    <div>
      <p>
        Politeia will send you a link to verify your email address.
        <span style={{ fontWeight: "bold" }}>
          {" "}
          You must open this link in the same browser.
        </span>{" "}
        After verifying your email, Politeia will create your Politeia
        “identity”, which consists of a public/private cryptographic key pair
        and browser cookie. This is necessary to verify your identity and allow
        submission of proposals, commenting, voting, and other Politeia
        functions. After completing the signup process, you can export your
        identity (public/private keys) to another browser at any time.
      </p>
    </div>
  );
};

export default SignupWarning;
