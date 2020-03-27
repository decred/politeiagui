import * as Yup from "yup";
import { DCC_TYPE_ISSUANCE } from "src/containers/DCC";

export const dccValidationSchema = () =>
  Yup.object().shape({
    nomineeid: Yup.string().required("required"),
    type: Yup.number()
      .required("required")
      .min(1)
      .max(2),
    statement: Yup.string()
      .required("required")
      .max(5000),
    domain: Yup.number()
      .when("type", issuanceFieldValidator)
      .max(6),
    contractortype: Yup.number()
      .when("type", issuanceFieldValidator)
      .max(5)
  });

const issuanceFieldValidator = (type, schema) =>
  type === DCC_TYPE_ISSUANCE ? schema.min(1, "required") : schema.min(0);
