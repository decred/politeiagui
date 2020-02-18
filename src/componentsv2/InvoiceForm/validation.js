import * as Yup from "yup";
import { yupFieldMatcher } from "src/utils/validation";

export const invoiceValidationSchema = ({
  cmscontactsupportedchars,
  cmsnamelocationsupportedchars,
  validmimetypes,
  maxlocationlength,
  minlocationlength,
  mincontactlength,
  maxcontactlength,
  minnamelength,
  maxnamelength,
  minlineitemcollength,
  maxlineitemcollength,
  invoicefieldsupportedchars,
  maximagesize,
  maximages
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
          type: Yup.number()
            .required("required")
            .oneOf([1, 2, 3, 4]),
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
          labor: Yup.number().min(0),
          subuserid: Yup.string().when("type", (type, schema) =>
            type === 4 ? schema.required("required") : schema
          ),
          subrate: Yup.number().when("type", (type, schema) =>
            type === 4
              ? schema
                  .required("required")
                  .min(500, "must be greater or equal to 5")
                  .max(50000, "must be less or equal to 500")
              : schema
          ),
          expenses: Yup.number().min(0)
        })
      )
      .min(1),
    files: Yup.array().files(maximagesize, maximages, validmimetypes)
  });

/** Captures a value such as 'lineitems[0].description' */
const lineItemPathRegex = /[A-z]*\[[0-9]*\]\.[A-z]*/gm;

/**
 * Converts an array of raw line item error messages to a more human
 * readable version.
 * For example: "lineitems[0].description must have at least 3 characters"
 * becomes: "description must have at least 3 characters"
 * @param {Array} errors
 * @returns {Array} improvedErrors
 */
export const improveLineItemErrors = (errors = []) => {
  return errors.map((err = {}) => {
    return Object.keys(err).reduce((res, field) => {
      const errMsg = err[field];
      return { ...res, [field]: errMsg.replace(lineItemPathRegex, field) };
    }, {});
  });
};
