import * as Yup from "yup";
import { PROPOSAL_BILLING_STATUS_CLOSED } from "src/constants";

const billingStatusRequiresReason = (billingStatus, schema) =>
  billingStatus === PROPOSAL_BILLING_STATUS_CLOSED
    ? schema.required("required")
    : schema;

export const validationSchema = Yup.object().shape({
  billingStatus: Yup.number().required("Required"),
  reason: Yup.string().when("billingStatus", billingStatusRequiresReason)
});
