import { H1 } from "pi-ui";
import React from "react";
import { Input, RecordForm, SubmitButton } from "../RecordForm";

export const LoginForm = ({ onSubmit, className }) => {
  return (
    <RecordForm className={className} onSubmit={onSubmit}>
      <H1>Log In</H1>
      <Input name="email" label="E-mail" id="email" />
      <Input name="password" type="password" label="Password" id="pass" />
      <SubmitButton>Login</SubmitButton>
    </RecordForm>
  );
};

export const SignupForm = ({ onSubmit, className }) => {
  return (
    <RecordForm className={className} onSubmit={onSubmit}>
      <H1>Create a new account</H1>
      {/* TODO: Replace TextInput by Input from #2884 */}
      <Input name="email" label="E-mail" id="email" />
      <Input name="username" label="Username" id="username" />
      <Input name="password" type="password" label="Password" id="pass" />
      <Input
        name="verifypass"
        type="password"
        label="Verify Password"
        id="vpass"
      />
      <SubmitButton>Sign Up</SubmitButton>
    </RecordForm>
  );
};

export const VerificationEmailForm = ({ onSubmit, className }) => {
  return (
    <RecordForm className={className} onSubmit={onSubmit}>
      <H1>Resend Verification Email</H1>
      <Input name="email" label="E-mail" id="email" />
      <Input name="username" label="Username" id="username" />
      <SubmitButton>Resend</SubmitButton>
    </RecordForm>
  );
};

export const PasswordResetForm = ({
  onSubmit,
  className,
  requestMode = false,
}) => (
  <RecordForm className={className} onSubmit={onSubmit}>
    {requestMode ? (
      <>
        <H1>Request Password Reset</H1>
        <Input name="email" label="E-mail" id="email" />
        <Input name="username" label="Username" id="username" />
        <SubmitButton>Reset</SubmitButton>
      </>
    ) : (
      <>
        <H1>Reset Password</H1>
        <Input name="password" label="New Password" type="password" id="pass" />
        <Input
          name="verifypass"
          label="Verify New Password"
          type="password"
          id="pass"
        />
        <SubmitButton>Reset</SubmitButton>
      </>
    )}
  </RecordForm>
);
