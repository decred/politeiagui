import * as Yup from "yup";
import { yupFieldMatcher } from "src/utils/validation";

const commentValidationSchema = ({
  namesupportedchars,
  namelengthmax,
  namelengthmin
}) =>
  Yup.object().shape(
    {
      comment: Yup.string().required("required"),
      title: Yup.string()
        .nullable()
        .notRequired()
        .when("title", {
          is: (value) => value?.length,
          then: (rule) =>
            rule
              .min(namelengthmin)
              .max(namelengthmax)
              .matches(...yupFieldMatcher("Title", namesupportedchars))
        })
    },
    // Add Cyclic deps here because when require itself
    ["title", "title"]
  );

export default commentValidationSchema;
