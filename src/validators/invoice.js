import * as Yup from "yup";
import { yupFieldMatcher } from "src/utils/validation";

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
      .matches(...yupFieldMatcher("Name", cmsnamelocationsupportedchars)),
    location: Yup.string()
      .required("required")
      .min(minlocationlength)
      .max(maxlocationlength)
      .matches(...yupFieldMatcher("Location", cmsnamelocationsupportedchars)),
    contact: Yup.string()
      .required("required")
      .min(mincontactlength)
      .max(maxcontactlength)
      .matches(...yupFieldMatcher("Contact", cmscontactsupportedchars)),
    rate: Yup.number()
      .required("required")
      .min(5)
      .max(500)
      .typeError("rate must be a number"),
    address: Yup.string().required("required"),
    lineitems: Yup.array()
      .of(
        Yup.object().shape({
          type: Yup.string()
            .required("required")
            .oneOf(["1", "2", "3", "4"]),
          domain: Yup.string()
            .required("required")
            .min(minlineitemcollength)
            .max(maxlineitemcollength)
            .matches(...yupFieldMatcher("Domain", invoicefieldsupportedchars)),
          subdomain: Yup.string()
            .required("required")
            .min(minlineitemcollength)
            .max(maxlineitemcollength)
            .matches(
              ...yupFieldMatcher("Sub domain", invoicefieldsupportedchars)
            ),
          description: Yup.string()
            .min(minlineitemcollength)
            .max(maxlineitemcollength)
            .matches(
              ...yupFieldMatcher("Description", invoicefieldsupportedchars)
            ),
          labor: Yup.number(),
          subuserid: Yup.string().when("type", (type, schema) =>
            +type === 4 ? schema.required("required") : schema
          ),
          subrate: Yup.number().when("type", (type, schema) =>
            +type === 4
              ? schema
                  .min(500, "must be greater or equal 5")
                  .max(50000, "must be less or equal 500")
              : schema
          ),
          expense: Yup.number()
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
