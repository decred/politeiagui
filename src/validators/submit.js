import {
  validate as proposalValidate,
  synchronousValidation as proposalSynchronousValidation
} from "./proposal";
import {
  validate as invoiceValidate,
  synchronousValidation as invoiceSynchronousValidation
} from "./invoice";

const validate = (values, dispatch, props) => {
  return props.isCMS
    ? invoiceValidate(values, dispatch, props)
    : proposalValidate(values, dispatch, props);
};

const synchronousValidation = (values, props) => {
  return props.isCMS
    ? invoiceSynchronousValidation(values, props)
    : proposalSynchronousValidation(values, props);
};

export { validate, synchronousValidation };
