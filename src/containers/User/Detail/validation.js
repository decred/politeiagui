import * as Yup from "yup";
import { maxLengthMessage, minLengthMessage } from "src/utils/validation";

export const reasonValidationSchema = () =>
  Yup.object().shape({
    reason: Yup.string().required("Required")
  });

export const changePasswordValidationSchema = ({ minpasswordlength }) =>
  Yup.object().shape({
    newPassword: Yup.string()
      .min(minpasswordlength, minLengthMessage("password", minpasswordlength))
      .required("Required"),
    newPasswordVerify: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Required"),
    existingPassword: Yup.string()
      .min(minpasswordlength, minLengthMessage("password", minpasswordlength))
      .required("Required")
  });

const buildUsernameRegex = (supportedChars) => {
  let regex = supportedChars.reduce((str, v) => str + v, "^[");
  regex += "]*$";
  return new RegExp(regex);
};
export const changeUsernameValidationSchema = ({
  minusernamelength,
  usernamesupportedchars,
  maxusernamelength,
  minpasswordlength
}) =>
  Yup.object().shape({
    newUsername: Yup.string()
      .matches(
        buildUsernameRegex(usernamesupportedchars),
        {
          excludeEmptyString: true
        },
        { message: "Invalid username" }
      )
      .min(minusernamelength, minLengthMessage("username", minusernamelength))
      .max(maxusernamelength, maxLengthMessage("username", maxusernamelength))
      .required("Required"),
    password: Yup.string()
      .min(minpasswordlength, minLengthMessage("password", minpasswordlength))
      .required("Required")
  });
