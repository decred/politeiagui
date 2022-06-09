import * as Yup from "yup";
import { yupFieldMatcher } from "src/utils/validation";

const commentValidationSchema = ({
  namesupportedchars,
  namelengthmax,
  namelengthmin,
  isAuthorUpdate
}) =>
  Yup.object().shape({
    comment: Yup.string().trim().required("required"),
    title: isAuthorUpdate
      ? Yup.string()
          .nullable()
          .required("required")
          .min(namelengthmin)
          .max(namelengthmax)
          .matches(...yupFieldMatcher("Title", namesupportedchars))
      : undefined
  });

export default commentValidationSchema;
