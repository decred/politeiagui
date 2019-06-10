import * as Yup from "yup";

export const loginValidationSchema = ({ minpasswordlength }) =>
  Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Required"),
    password: Yup.string()
      .min(
        minpasswordlength,
        `Password must be at least ${minpasswordlength} characters`
      )
      .required("Required")
  });
