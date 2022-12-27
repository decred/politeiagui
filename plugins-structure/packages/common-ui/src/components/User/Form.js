import { H1 } from "pi-ui";
import React from "react";
import { RecordForm } from "../RecordForm";

export const LoginForm = ({ onSubmit, className }) => {
  return (
    <RecordForm className={className} onSubmit={onSubmit}>
      {({ TextInput: Input, SubmitButton }) => (
        <>
          <H1>Log In</H1>
          {/* TODO: Replace TextInput by Input from #2884 */}
          <Input name="email" placeholder="E-mail" />
          <Input name="password" type="password" placeholder="Password" />
          <SubmitButton>Login</SubmitButton>
        </>
      )}
    </RecordForm>
  );
};

export const SignupForm = ({ onSubmit, className }) => {
  return (
    <RecordForm className={className} onSubmit={onSubmit}>
      {({ TextInput: Input, SubmitButton }) => (
        <>
          <H1>Create a new account</H1>
          {/* TODO: Replace TextInput by Input from #2884 */}
          <Input name="email" placeholder="E-mail" />
          <Input name="username" placeholder="Username" />
          <Input name="password" type="password" placeholder="Password" />
          <Input
            name="verifypass"
            type="password"
            placeholder="Verify Password"
          />
          <SubmitButton>Sign Up</SubmitButton>
        </>
      )}
    </RecordForm>
  );
};

export const VerificationEmailForm = ({ onSubmit, className }) => {
  return (
    <RecordForm className={className} onSubmit={onSubmit}>
      {({ TextInput: Input, SubmitButton }) => (
        <>
          <H1>Resend Verification Email</H1>
          <Input name="email" placeholder="E-mail" />
          <Input name="username" placeholder="Username" />
          <SubmitButton>Resend</SubmitButton>
        </>
      )}
    </RecordForm>
  );
};
