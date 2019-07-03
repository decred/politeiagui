import * as Yup from "yup";

export const changePasswordValidationSchema = ({ minpasswordlength }) =>
  Yup.object().shape({
    newPassword: Yup.string()
      .min(
        minpasswordlength,
        `Password must be at least ${minpasswordlength} characters`
      )
      .required("Required"),
    newPasswordVerify: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Required"),
    existingPassword: Yup.string()
      .min(
        minpasswordlength,
        `Password must be at least ${minpasswordlength} characters`
      )
      .required("Required")
  });

const buildUsernameRegex = supportedChars => {
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
      .min(
        minusernamelength,
        `Username must be at least ${minusernamelength} characters`
      )
      .max(
        maxusernamelength,
        `Username must be at most ${maxusernamelength} characters`
      )
      .required("Required"),
    password: Yup.string()
      .min(
        minpasswordlength,
        `Password must be at least ${minpasswordlength} characters`
      )
      .required("Required")
  });
