import * as Yup from "yup";

const buildUsernameRegex = supportedChars => {
  let regex = supportedChars.reduce((str, v) => str + v, "^[");
  regex += "]*$";
  return new RegExp(regex);
};

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
      .required("required"),
    username: Yup.string()
      .matches(
        buildUsernameRegex(usernamesupportedchars),
        {
          excludeEmptyString: true
        },
        { message: "invalid username" }
      )
      .min(minusernamelength)
      .max(maxusernamelength)
      .required("required"),
    password: Yup.string()
      .min(minpasswordlength)
      .required("required"),
    verify_password: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("required"),
    verificationtoken: withVerificationToken
      ? Yup.string().required("required")
      : Yup.string()
  });
