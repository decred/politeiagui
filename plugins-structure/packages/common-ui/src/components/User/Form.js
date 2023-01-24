import { H1 } from "pi-ui";
import React from "react";
import { Input, RecordForm, SubmitButton } from "../RecordForm";
// Validation
import { yupResolver } from "@hookform/resolvers/yup";
import {
  validateLoginForm,
  validatePasswordResetForm,
  validatePasswordResetRequestForm,
  validateSignupForm,
  validateVerificationEmailResendForm,
} from "./validation";

export const LoginForm = ({ onSubmit, className }) => {
  return (
    <RecordForm
      className={className}
      onSubmit={onSubmit}
      resolver={yupResolver(validateLoginForm())}
    >
      <H1>Log In</H1>
      <Input name="email" label="E-mail" id="email" />
      <Input name="password" type="password" label="Password" id="pass" />
      <SubmitButton data-testid="login-form-button">Login</SubmitButton>
    </RecordForm>
  );
};

export const SignupForm = ({
  onSubmit,
  className,
  usernameValidationRegex,
  minpasswordlength,
}) => {
  return (
    <RecordForm
      className={className}
      onSubmit={onSubmit}
      resolver={yupResolver(
        validateSignupForm({
          usernameRegex: usernameValidationRegex,
          minpasswordlength,
        })
      )}
    >
      <H1>Create a new account</H1>
      <Input name="email" label="E-mail" id="email" />
      <Input name="username" label="Username" id="username" />
      <Input name="password" type="password" label="Password" id="pass" />
      <Input
        name="verifypass"
        type="password"
        label="Verify Password"
        id="vpass"
      />
      <SubmitButton data-testid="signup-form-button">Sign Up</SubmitButton>
    </RecordForm>
  );
};

export const VerificationEmailForm = ({ onSubmit, className }) => {
  return (
    <RecordForm
      className={className}
      onSubmit={onSubmit}
      resolver={yupResolver(validateVerificationEmailResendForm())}
    >
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
  minpasswordlength,
}) => (
  <RecordForm
    className={className}
    onSubmit={onSubmit}
    resolver={yupResolver(
      requestMode
        ? validatePasswordResetRequestForm()
        : validatePasswordResetForm({ minpasswordlength })
    )}
  >
    {requestMode ? (
      <>
        <H1>Request Password Reset</H1>
        <Input name="email" label="E-mail" id="email" />
        <Input name="username" label="Username" id="username" />
        <SubmitButton data-testid="password-reset-form-request-button">
          Reset
        </SubmitButton>
      </>
    ) : (
      <>
        <H1>Reset Password</H1>
        <Input name="password" label="New Password" type="password" id="pass" />
        <Input
          name="verifypass"
          label="Verify New Password"
          type="password"
          id="vpass"
        />
        <SubmitButton data-testid="password-reset-form-button">
          Reset
        </SubmitButton>
      </>
    )}
  </RecordForm>
);
