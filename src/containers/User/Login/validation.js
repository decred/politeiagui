import * as Yup from "yup";
import {
  maxLengthMessage,
  minLengthMessage,
  yupFieldMatcher
} from "src/utils/validation";

export const loginValidationSchema = ({
  minpasswordlength,
  usernamesupportedchars,
  minusernamelength,
  maxusernamelength
}) =>
  Yup.object().shape({
    username: Yup.string()
      .matches(...yupFieldMatcher("username", usernamesupportedchars))
      .min(minusernamelength, minLengthMessage("username", minusernamelength))
      .max(maxusernamelength, maxLengthMessage("username", maxusernamelength))
      .required("Required"),
    password: Yup.string()
      .min(
        minpasswordlength,
        `Password must be at least ${minpasswordlength} characters`
      )
      .required("Required")
  });
