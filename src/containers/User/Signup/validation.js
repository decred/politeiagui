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
      .required("Required"),
    username: Yup.string()
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
      .required("Required"),
    verify_password: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
    verificationtoken: withVerificationToken
      ? Yup.string().required("required")
      : Yup.string()
  });
