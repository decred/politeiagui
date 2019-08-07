import * as Yup from "yup";
import {
  yupFieldMatcher,
  minLengthMessage,
  maxLengthMessage,
  maxFileSizeMessage,
  validMimeTypesMessage
} from "src/utils/validation";

export const proposalValidationSchema = ({
  proposalnamesupportedchars,
  maxproposalnamelength,
  minproposalnamelength,
  validmimetypes,
  maximagesize,
  maxmdsize
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
    description: Yup.string().required("Required"),
    files: Yup.array().of(
      Yup.object().shape({
        mime: Yup.string()
          .required()
          .oneOf(validmimetypes, validMimeTypesMessage(validmimetypes)),
        name: Yup.string().required(),
        payload: Yup.string().required(),
        size: Yup.number()
          .required()
          .when("mime", {
            is: m => m.startsWith("image/"),
            then: Yup.number().max(
              maximagesize,
              maxFileSizeMessage(maximagesize)
            ),
            otherwise: Yup.number().max(
              maxmdsize,
              maxFileSizeMessage(maxmdsize)
            )
          })
      })
    )
  });
