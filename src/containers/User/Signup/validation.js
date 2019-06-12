import * as Yup from "yup";
import {
  maxLengthMessage,
  minLengthMessage,
  yupFieldMatcher
} from "src/utils/validation";

export const signupValidationSchema = (
  {
    minpasswordlength,
    minusernamelength,
    maxusernamelength,
    usernamesupportedchars
  },
  withVerificationToken
) =>
  Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Required"),
    username: Yup.string()
      .matches(...yupFieldMatcher("username", usernamesupportedchars))
      .min(minusernamelength, minLengthMessage("username", minusernamelength))
      .max(maxusernamelength, maxLengthMessage("username", maxusernamelength))
      .required("Required"),
    password: Yup.string()
      .min(minpasswordlength, minLengthMessage("password", minpasswordlength))
      .required("Required"),
    verify_password: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
    verificationtoken: withVerificationToken
      ? Yup.string().required("Required")
      : Yup.string()
  });
