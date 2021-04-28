import * as Yup from "yup";
// import {
//   maxLengthMessage,
//   minLengthMessage,
//   yupFieldMatcher
// } from "src/utils/validation";

/*
  NOTE: Code that validates login via username is commented out until
  pi reintroduces it. Currently, the login returned to email.
*/
export const loginValidationSchema = ({
  minpasswordlength
  // usernamesupportedchars,
  // minusernamelength,
  // maxusernamelength
}) =>
  Yup.object().shape({
    // username: Yup.string()
    //   .matches(...yupFieldMatcher("username", usernamesupportedchars))
    //   .min(minusernamelength, minLengthMessage("username", minusernamelength))
    //   .max(maxusernamelength, maxLengthMessage("username", maxusernamelength))
    //   .required("Required"),
    email: Yup.string().trim().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(
        minpasswordlength,
        `Password must be at least ${minpasswordlength} characters`
      )
      .required("Required")
  });
