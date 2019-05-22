import * as Yup from "yup";

const invoiceValidationSchema = ({
  cmscontactsupportedchars,
  cmsnamelocationsupportedchars,
  maxlocationlength,
  minlocationlength,
  mincontactlength,
  maxcontactlength,
  minnamelength,
  maxnamelength,
  minlineitemcollength,
  maxlineitemcollength,
  invoicefieldsupportedchars
}) =>
  Yup.object().shape({
    name: Yup.string()
      .required("required")
      .min(minnamelength)
      .max(maxnamelength)
      .matches(...fieldMatcher("Name", cmsnamelocationsupportedchars)),
    location: Yup.string()
      .required("required")
      .min(minlocationlength)
      .max(maxlocationlength)
      .matches(...fieldMatcher("Location", cmsnamelocationsupportedchars)),
    contact: Yup.string()
      .required("required")
      .min(mincontactlength)
      .max(maxcontactlength)
      .matches(...fieldMatcher("Contact", cmscontactsupportedchars)),
    rate: Yup.number()
      .required("required")
      .min(5)
      .max(500),
    address: Yup.string().required("required"),
    lineitems: Yup.array()
      .of(
        Yup.object().shape({
          type: Yup.string()
            .required("required")
            .oneOf(["1", "2", "3"]),
          domain: Yup.string()
            .required("required")
            .min(minlineitemcollength)
            .max(maxlineitemcollength)
            .matches(...fieldMatcher("Domain", invoicefieldsupportedchars)),
          subdomain: Yup.string()
            .required("required")
            .min(minlineitemcollength)
            .max(maxlineitemcollength)
            .matches(...fieldMatcher("Sub domain", invoicefieldsupportedchars)),
          description: Yup.string()
            .min(minlineitemcollength)
            .max(maxlineitemcollength)
            .matches(...fieldMatcher("Description", invoicefieldsupportedchars))
        })
      )
      .min(1)
  });

/** Captures a value such as 'lineitems[0].description' */
const lineItemPathRegex = /[A-z]*\[[0-9]*\]\.[A-z]*/gm;

const getErrorForLineItem = (errors, errPath, errMessage) => {
  const column = errPath.split(".")[1];
  const position = +/\[([0-9])*\]/gm.exec(errPath)[1] + 1;
  const message = `'${column}' of item ${position} ${errMessage.replace(
    lineItemPathRegex,
    ""
  )}`;
  return (errors.lineitems || []).concat([message]);
};

export function yupToFormErrors(yupError) {
  let errors = {};
  if (yupError.inner.length === 0) {
    return { ...errors, [yupError.path]: yupError.message };
  }
  for (const err of yupError.inner) {
    if (!errors[err.path]) {
      const isLineItemPath = lineItemPathRegex.test(err.path);
      if (isLineItemPath) {
        errors = {
          ...errors,
          lineitems: getErrorForLineItem(errors, err.path, err.message)
        };
      } else {
        errors = { ...errors, [err.path]: err.message };
      }
    }
  }
  return errors;
}

const buildRegexFromSupportedChars = supportedChars => {
  const concatedChars = supportedChars.reduce((str, v) => str + `\\${v}`, "");
  const regex = "^[" + concatedChars + "]*$";
  return new RegExp(regex);
};

const invalidMessage = (fieldName, supportedChars) =>
  `${fieldName} is not valid. Valid chars are ${buildValidCharsStrFromSupportedChars(
    supportedChars
  )} `;

const fieldMatcher = (fieldName, supportedChars) => {
  return [
    buildRegexFromSupportedChars(supportedChars),
    {
      excludeEmptyString: true,
      message: invalidMessage(fieldName, supportedChars)
    }
  ];
};

const buildValidCharsStrFromSupportedChars = supportedChars =>
  supportedChars.reduce((str, v) => str + v, "");

const synchronousValidation = (values, { policy }) => {
  if (!policy)
    return {
      waiting: "policy"
    };
  const validationSchema = invoiceValidationSchema(policy);
  try {
    validationSchema.validateSync(values, { abortEarly: false });
    return {};
  } catch (e) {
    return yupToFormErrors(e);
  }
};

export { synchronousValidation };
