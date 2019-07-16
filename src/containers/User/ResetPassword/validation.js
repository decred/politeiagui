import * as Yup from "yup";
import {
  maxLengthMessage,
  minLengthMessage,
  yupFieldMatcher
} from "src/utils/validation";

const usernameValidator = ({
  minusernamelength,
  maxusernamelength,
  usernamesupportedchars
}) =>
  Yup.string()
    .matches(...yupFieldMatcher("username", usernamesupportedchars))
    .min(minusernamelength, minLengthMessage("username", minusernamelength))
    .max(maxusernamelength, maxLengthMessage("username", maxusernamelength))
    .required("Required");

export const requestResetValidationSchema = policy =>
  Yup.object().shape({
    username: usernameValidator(policy),
    email: Yup.string()
      .email("Invalid email")
      .required("Required")
  });

export const resetValidationSchema = ({ minpasswordlength }) =>
  Yup.object().shape({
    newpassword: Yup.string()
      .min(minpasswordlength)
      .required("Required"),
    verify_password: Yup.string()
      .oneOf([Yup.ref("newpassword")], "Passwords must match")
      .required("Required")
  });

export const urlParamsValidationSchema = policy =>
  Yup.object().shape({
    username: usernameValidator(policy),
    verificationtoken: Yup.string().required("Verification token is required")
  });
