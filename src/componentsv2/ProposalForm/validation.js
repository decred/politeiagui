import * as Yup from "yup";
import {
  yupFieldMatcher,
  minLengthMessage,
  maxLengthMessage
} from "src/utils/validation";

export const proposalValidationSchema = ({
  proposalnamesupportedchars,
  maxproposalnamelength,
  minproposalnamelength
}) =>
  Yup.object().shape({
    name: Yup.string()
      .min(
        minproposalnamelength,
        minLengthMessage("name", minproposalnamelength)
      )
      .max(
        maxproposalnamelength,
        maxLengthMessage("name", maxproposalnamelength)
      )
      .matches(...yupFieldMatcher("Name", proposalnamesupportedchars))
      .required("Required"),
    description: Yup.string().required("Required")
  });
