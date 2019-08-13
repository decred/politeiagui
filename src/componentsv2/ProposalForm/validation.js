import * as Yup from "yup";
import {
  yupFieldMatcher,
  minLengthMessage,
  maxLengthMessage,
  maxFileSizeMessage,
  maxImageFilesMessage,
  maxTextFilesMessage,
  validMimeTypesMessage
} from "src/utils/validation";

export const proposalValidationSchema = ({
  proposalnamesupportedchars,
  maxproposalnamelength,
  minproposalnamelength,
  validmimetypes,
  maximages,
  maximagesize,
  maxmds,
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
      .matches(...yupFieldMatcher("Name", proposalnamesupportedchars)),
    description: Yup.string().required("Required"),
    files: Yup.array().of(
      Yup.object().shape({
        mime: Yup.string().oneOf(
          validmimetypes,
          validMimeTypesMessage(validmimetypes)
        ),
        name: Yup.string(),
        payload: Yup.string(),
        size: Yup.number().when("mime", {
          is: m => m.startsWith("image/"),
          then: Yup.number().max(maximagesize, maxFileSizeMessage()),
          otherwise: Yup.number().max(maxmdsize, maxFileSizeMessage())
        })
      })
    ),
    imgCount: Yup.number()
      .notRequired()
      .max(maximages, maxImageFilesMessage(maximages)),
    mdCount: Yup.number()
      .notRequired()
      .max(maxmds, maxTextFilesMessage())
  });

export const countImgFiles = files => {
  const fs = Array.isArray(files) ? files : [files];
  return fs.reduce(
    (c, file) => (file.mime.startsWith("image/") ? c + 1 : c),
    0
  );
};

// Count starts at 1 to include the index file of a proposal
export const countMdFiles = files => {
  const fs = Array.isArray(files) ? files : [files];
  return fs.reduce(
    (c, file) => (file.mime.startsWith("text/plain") ? c + 1 : c),
    1
  );
};

// This function is used to control what files will be included in the UI
// according to pi policies and UX interactions.
export const getValidatedFiles = (files, { maximages, maxmds }) => {
  const imgCount = countImgFiles(files);
  const mdCount = countMdFiles(files);

  if (imgCount > maximages + 1) files.shift();

  if (mdCount > maxmds + 1) files.shift();

  return files;
};
