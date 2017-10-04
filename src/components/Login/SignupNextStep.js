import React from "react";

const SignupNextStep = ({ email }) => (
  <div className="signup-next-step">
    <p>Please check your inbox at {email} to verify your registration.</p>
  </div>
);

export default SignupNextStep;
