import * as Yup from "yup";

export const loginValidationSchema = ({ minpasswordlength }) =>
  Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("required"),
    password: Yup.string()
      .min(minpasswordlength)
      .required("required")
  });
