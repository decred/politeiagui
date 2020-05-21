import * as Yup from "yup";
import { minAmountMessage, maxAmountMessage } from "src/utils/validation";

const MIN_QUORUM_PERCENTAGE = 0;
const MAX_QUORUM_PERCENTAGE = 100;
const MIN_PASS_PERCENTAGE = 0;
const MAX_PASS_PERCENTAGE = 100;

export const validationSchema = Yup.object().shape({
  quorumPercentage: Yup.number()
    .required("required")
    .min(
      MIN_QUORUM_PERCENTAGE,
      minAmountMessage("quorum percentage", MIN_QUORUM_PERCENTAGE)
    )
    .max(
      MAX_QUORUM_PERCENTAGE,
      maxAmountMessage("quorum percentage", MAX_QUORUM_PERCENTAGE)
    ),
  passPercentage: Yup.number()
    .required("required")
    .min(
      MIN_PASS_PERCENTAGE,
      minAmountMessage("pass percentage", MIN_PASS_PERCENTAGE)
    )
    .max(
      MAX_PASS_PERCENTAGE,
      maxAmountMessage("pass percentage", MAX_PASS_PERCENTAGE)
    )
});
