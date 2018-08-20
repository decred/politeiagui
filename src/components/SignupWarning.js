import React from "react";
const SignupWarning = () => {
  return (
    <div>
      <p>
        When you sign up, an identity will be created for you which is tied
        to your browser. This identity is required for things like submitting
        proposals and leaving comments.
      </p>
      <p>
        Politeia will send you a link to verify your email address, and{" "}
        <span style={{ fontWeight: "bold" }}>you must open this link in this
        same browser</span>, because your new identity will be used
        to help verify it.
      </p>
      <p>
        After you verify your email, you will be able to log in and copy your
        identity to other browsers, but for this signup process, you must use
        the same browser and ensure that you aren't using a private/incognito
        window and that you don't clear your cookies.
      </p>
    </div>
  );
};

export default SignupWarning;
