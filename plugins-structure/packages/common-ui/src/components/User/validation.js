import * as yup from "yup";

const EMAIL_REQUIRED = "E-mail is required";
const EMAIL_VALID = "Must be a valid e-mail address";
const PASSWORD_REQUIRED = "Password is required";
const PASSWORD_VERIFY_REQUIRED = "Verify Password is required";
const USERNAME_REQUIRED = "Username is required";

export function validateLoginForm() {
  return yup.object().shape({
    email: yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    password: yup.string().required(PASSWORD_REQUIRED),
  });
}

export function validateSignupForm({
  usernameRegex = new RegExp(/^\w+$/g),
  minpasswordlength = 8,
} = {}) {
  return yup.object().shape({
    email: yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    username: yup
      .string()
      .matches(usernameRegex, { excludeEmptyString: true })
      .required(USERNAME_REQUIRED),
    password: yup
      .string()
      .min(
        minpasswordlength,
        `Password must be at least ${minpasswordlength} characters long`
      )
      .required(PASSWORD_REQUIRED),
    verifypass: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required(PASSWORD_VERIFY_REQUIRED),
  });
}

export function validateVerificationEmailResendForm() {
  return yup.object().shape({
    email: yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    username: yup.string().required(USERNAME_REQUIRED),
  });
}

export function validatePasswordResetRequestForm() {
  return yup.object().shape({
    email: yup.string().email(EMAIL_VALID).required(EMAIL_REQUIRED),
    username: yup.string().required(USERNAME_REQUIRED),
  });
}

export function validatePasswordResetForm({ minpasswordlength = 8 } = {}) {
  return yup.object().shape({
    password: yup
      .string()
      .min(
        minpasswordlength,
        `Password must be at least ${minpasswordlength} characters long`
      )
      .required(PASSWORD_REQUIRED),
    verifypass: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required(PASSWORD_VERIFY_REQUIRED),
  });
}

export function validatePasswordChangeForm({ minpasswordlength = 8 } = {}) {
  return yup.object().shape({
    current: yup.string().required(PASSWORD_REQUIRED),
    newpassword: yup
      .string()
      .min(
        minpasswordlength,
        `Password must be at least ${minpasswordlength} characters long`
      )
      .required(PASSWORD_REQUIRED),
    verify: yup
      .string()
      .oneOf([yup.ref("newpassword"), null], "Passwords must match")
      .required(PASSWORD_VERIFY_REQUIRED),
  });
}

export function validateUsernameChangeForm({
  usernameRegex = new RegExp(/^\w+$/g),
}) {
  return yup.object().shape({
    username: yup
      .string()
      .matches(usernameRegex, { excludeEmptyString: true })
      .required(USERNAME_REQUIRED),
    password: yup.string().required(PASSWORD_REQUIRED),
  });
}

export function validateIdentityImportForm() {
  return yup.object().shape({
    publicKey: yup.string().required(),
    secretKey: yup.string().required(),
  });
}
