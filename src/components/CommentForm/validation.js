import * as Yup from "yup";

const commentValidationSchema = Yup.object().shape({
  comment: Yup.string().required("Required")
});

export default commentValidationSchema;
