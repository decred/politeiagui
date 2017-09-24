import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import { or } from "../lib/fp";
import * as api from "./api";

export const isShowingSignup = or(
  state => state.app.isShowingSignup && !api.apiNewUserResponse(state),
  api.isApiRequestingNewUser,
  api.isApiRequestingVerifyNewUser,
  api.apiNewUserError,
  api.apiVerifyNewUserError
);

export const newProposalName = get(["app", "newProposal", "name"]);
export const newProposalDescription = get(["app", "newProposal", "description"]);

export const newProposalNameIsInvalid = compose(name => !name, newProposalName);
export const newProposalDescriptionIsInvalid = compose(
  description => !description, newProposalDescription
);
export const newProposalIsInvalid = or(
  newProposalNameIsInvalid,
  newProposalDescriptionIsInvalid
);
