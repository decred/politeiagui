import * as Yup from "yup";

export const requestResendEmailValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required")
  });

export const urlParamsValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    verificationtoken: Yup.string().required("Verification token is required")
  });
