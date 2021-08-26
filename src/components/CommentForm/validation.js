import * as Yup from "yup";
import { yupFieldMatcher } from "src/utils/validation";

const commentValidationSchema = ({
  namesupportedchars,
  namelengthmax,
  namelengthmin
}) =>
  Yup.object().shape({
    comment: Yup.string().required("required"),
    title: Yup.string()
      .required("required")
      .min(namelengthmin)
      .max(namelengthmax)
      .matches(...yupFieldMatcher("Title", namesupportedchars))
  });

export default commentValidationSchema;
