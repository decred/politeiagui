import * as yup from "yup";
import { buildRegexFromSupportedChars } from "../policy/utils";
import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_SUBMISSION,
} from "./constants";
/**
 * validatePiSummariesPageSize receives the state and returns if pi
 * summariespagesize exists. If no policy is loaded, it will throw and log an
 * error.
 * @param {Object} state
 */
export function validatePiSummariesPageSize(state) {
  const pageSize =
    state &&
    state.piPolicy &&
    state.piPolicy.policy &&
    state.piPolicy.policy.summariespagesize;

  // throw if there is no policy loaded
  if (!pageSize) {
    const error = Error("Pi policy should be loaded before fetching summaries");
    console.error(error);
    throw error;
  }
  return true;
}

export function validatePiBillingStatusChangesPageSize(state) {
  const pageSize =
    state &&
    state.piPolicy &&
    state.piPolicy.policy &&
    state.piPolicy.policy.billingstatuschangespagesize;

  if (!pageSize) {
    const error = Error(
      "Pi policy should be loaded before fetching billing status changes"
    );
    console.error(error);
    throw error;
  }
  return true;
}

export const validateProposalForm = ({
  namelengthmin,
  namelengthmax,
  namesupportedchars,
  amountmin,
  amountmax,
  domains,
}) => {
  return yup.object().shape({
    type: yup
      .number()
      .oneOf([
        PROPOSAL_TYPE_RFP,
        PROPOSAL_TYPE_REGULAR,
        PROPOSAL_TYPE_SUBMISSION,
      ])
      .required(),
    name: yup
      .string()
      .min(namelengthmin)
      .max(namelengthmax)
      .matches(buildRegexFromSupportedChars(namesupportedchars), {
        excludeEmptyString: true,
      })
      .required(),
    amount: yup.number().when("type", {
      is: PROPOSAL_TYPE_RFP,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.min(amountmin).max(amountmax).required(),
    }),
    startDate: yup.number().when("type", {
      is: PROPOSAL_TYPE_RFP,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required(),
    }),
    endDate: yup
      .number()
      .when("type", {
        is: PROPOSAL_TYPE_RFP,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required(),
      })
      .when("startDate", {
        is: (sd) => sd > 0,
        then: (schema) => schema.min(yup.ref("startDate")),
        otherwise: (schema) => schema,
      }),
    domain: yup.string().required().oneOf(domains),
    body: yup.string().required(),
    // RFP Proposal
    deadline: yup.number().when("type", {
      is: PROPOSAL_TYPE_RFP,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    // RFP Submission
    rfpToken: yup.string().when("type", {
      is: PROPOSAL_TYPE_SUBMISSION,
      then: (schema) => schema.required().min(16),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};
