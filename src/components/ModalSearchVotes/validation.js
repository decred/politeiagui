import * as Yup from "yup";
import { minLengthMessage } from "src/utils/validation";

const TOKEN_MIN_LENGTH = 64;

const validationSchema = Yup.object().shape({
  search: Yup.string()
    .min(TOKEN_MIN_LENGTH, minLengthMessage("Ticket token", TOKEN_MIN_LENGTH))
    .required("Required")
});

export default validationSchema;
