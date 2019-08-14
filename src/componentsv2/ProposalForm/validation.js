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
}) => {
  /*
    Currently pi policy only allows 1 md file to be attached to a proposal.
    It corresponds to the index file, so it can only accept image attachments
    until this policy changes.
  */
  const validMimeTypes = validmimetypes.filter(mime =>
    mime.startsWith("image/")
  );
  return Yup.object().shape({
    name: Yup.string()
      .min(
        minproposalnamelength,
        minLengthMessage("name", minproposalnamelength)
      )
      .max(
        maxproposalnamelength,
        maxLengthMessage("name", maxproposalnamelength)
      )
      .matches(...yupFieldMatcher("Name", proposalnamesupportedchars)),
    description: Yup.string().required("Required"),
    files: Yup.array().of(
      Yup.object().shape({
        mime: Yup.string().oneOf(
          validMimeTypes,
          validMimeTypesMessage(validMimeTypes)
        ),
        name: Yup.string(),
        payload: Yup.string(),
        size: Yup.number().when("mime", {
          is: m => m.startsWith("image/"),
          then: Yup.number().max(maximagesize, maxFileSizeMessage()),
          otherwise: Yup.number().max(maxmdsize, maxFileSizeMessage())
        })
      })
    )
  });
};
