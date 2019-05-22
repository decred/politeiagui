import {
  validate as proposalValidate,
  synchronousValidation as proposalSynchronousValidation
} from "./proposal";
import { synchronousValidation as invoiceSynchronousValidation } from "./invoice";

const validate = (values, dispatch, props) => {
  return props.isCMS ? () => {} : proposalValidate(values, dispatch, props);
};

const synchronousValidation = (values, props) => {
  return props.isCMS
    ? invoiceSynchronousValidation(values, props)
    : proposalSynchronousValidation(values, props);
};

export { validate, synchronousValidation };
